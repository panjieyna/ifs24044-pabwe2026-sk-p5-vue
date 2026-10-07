import { screen, fireEvent, waitFor } from '@testing-library/vue'
import { renderWithProviders } from '../../../test-utils.js'
import AucationLayout from './AucationLayout.vue'
import * as authApi from '../../auth/api/authApi.js'

vi.mock('../../auth/api/authApi.js')

it('logs out and goes to login', async () => {
  localStorage.setItem('accessToken', 't')
  authApi.logout.mockResolvedValue({ success: true })
  const { router } = renderWithProviders(AucationLayout)
  const push = vi.spyOn(router, 'push')
  await fireEvent.click(screen.getByRole('button', { name: 'Keluar' }))
  await waitFor(() => expect(push).toHaveBeenCalledWith('/auth/login'))
  expect(localStorage.getItem('accessToken')).toBeNull()
  expect(screen.getByRole('link', { name: 'Profil' })).toBeInTheDocument()
})
