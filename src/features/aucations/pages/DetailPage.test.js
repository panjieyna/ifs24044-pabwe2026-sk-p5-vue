import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import DetailPage from './DetailPage.vue'
import * as api from '../api/aucationApi.js'
import { showSuccessDialog, showErrorDialog, showConfirmDialog } from '../../../helpers/toolsHelper.js'

vi.mock('../api/aucationApi.js')
vi.mock('../../../helpers/toolsHelper.js', async (orig) => ({
  ...(await orig()), showSuccessDialog: vi.fn(), showErrorDialog: vi.fn(), showConfirmDialog: vi.fn(),
}))

const detail = (extra = {}) => ({
  success: true,
  data: { aucation: { id: 7, title: 'Lukisan', description: '**Cat** minyak', start_bid: 150000, closed_at: '2026-12-01T00:00:00Z', bids: [{ id: 1, bid: 200000 }], ...extra } },
})
const click = (name) => fireEvent.click(screen.getByRole('button', { name }))
const noDialog = () => expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

async function mount() {
  const utils = renderWithProviders(DetailPage, { route: '/aucations/7' })
  await screen.findByText('Lukisan')
  await waitFor(() => expect(api.getAucation).toHaveBeenCalledWith('7'))
  return utils
}

describe('DetailPage', () => {
  beforeEach(() => { vi.clearAllMocks(); api.getAucation.mockResolvedValue(detail()) })

  it('renders details, markdown and bids without a cover', async () => {
    await mount()
    expect(screen.getByText('Rp 200.000')).toBeInTheDocument()
    expect(screen.getByText('Cat').tagName).toBe('STRONG')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows the cover when present', async () => {
    api.getAucation.mockResolvedValue(detail({ cover: 'http://x/c.png' }))
    await mount()
    expect(screen.getByRole('img', { name: 'Sampul Lukisan' })).toBeInTheDocument()
  })

  it('places a bid: error keeps the modal, success closes it and reloads', async () => {
    await mount()
    const before = api.getAucation.mock.calls.length
    api.addBid.mockResolvedValueOnce({ success: false, message: 'Rendah' }).mockResolvedValueOnce({ success: true, message: 'Ok' })
    await click('Tawar')
    await fireEvent.update(screen.getByLabelText('Nominal penawaran'), '300000')
    await click('Kirim penawaran')
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith('Rendah'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await click('Kirim penawaran')
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith('Ok'))
    expect(api.addBid).toHaveBeenLastCalledWith('7', { bid: 300000 })
    await waitFor(noDialog)
    expect(api.getAucation.mock.calls.length).toBeGreaterThan(before)
  })

  it('edits the aucation', async () => {
    await mount()
    api.changeAucation.mockResolvedValueOnce({ success: false, message: 'Gagal ubah' }).mockResolvedValueOnce({ success: true, message: 'Diubah' })
    await click('Ubah lelang')
    await fireEvent.update(screen.getByLabelText('Judul'), 'Baru')
    await fireEvent.update(screen.getByLabelText('Deskripsi'), 'Desc baru')
    await fireEvent.update(screen.getByLabelText('Harga awal'), '200000')
    await fireEvent.update(screen.getByLabelText('Ditutup pada'), '2027-01-01T08:00')
    await click('Simpan perubahan')
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith('Gagal ubah'))
    await click('Simpan perubahan')
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith('Diubah'))
    expect(api.changeAucation).toHaveBeenLastCalledWith('7', { title: 'Baru', description: 'Desc baru', start_bid: 200000, closed_at: '2027-01-01 08:00:00' })
    await waitFor(noDialog)
  })

  it('changes the cover', async () => {
    await mount()
    api.changeCover.mockResolvedValueOnce({ success: false, message: 'Besar' }).mockResolvedValueOnce({ success: true, message: 'Sampul' })
    const file = new File(['x'], 'c.png', { type: 'image/png' })
    await click('Ubah sampul')
    await fireEvent.change(screen.getByLabelText('File sampul'), { target: { files: [file] } })
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith('Besar'))
    await fireEvent.change(screen.getByLabelText('File sampul'), { target: { files: [file] } })
    await waitFor(() => expect(showSuccessDialog).toHaveBeenCalledWith('Sampul'))
    expect(api.changeCover).toHaveBeenLastCalledWith('7', file)
    await waitFor(noDialog)
  })

  it('closes every modal with Escape', async () => {
    await mount()
    for (const name of ['Tawar', 'Ubah lelang', 'Ubah sampul']) {
      await click(name)
      await fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' })
      noDialog()
    }
  })

  it('does nothing when deletion is cancelled', async () => {
    await mount()
    showConfirmDialog.mockResolvedValue(false)
    await click('Hapus lelang')
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled())
    expect(api.deleteAucation).not.toHaveBeenCalled()
  })

  it('deletes and goes home, or shows an error', async () => {
    const { router } = await mount()
    const push = vi.spyOn(router, 'push')
    showConfirmDialog.mockResolvedValue(true)
    api.deleteAucation.mockResolvedValueOnce({ success: false, message: 'Tidak bisa' }).mockResolvedValueOnce({ success: true, message: 'Dihapus' })
    await click('Hapus lelang')
    await waitFor(() => expect(showErrorDialog).toHaveBeenCalledWith('Tidak bisa'))
    await click('Hapus lelang')
    await waitFor(() => expect(push).toHaveBeenCalledWith('/'))
  })
})
