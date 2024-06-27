import '@testing-library/jest-dom'
import {render,screen,fireEvent, waitFor} from "@testing-library/react";
import { faker } from '@faker-js/faker';
import AddProductForm from "@/app/product/createProduct/page";



jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push: jest.fn(),
    }),
  }));
  
  jest.mock('@/components/ui/use-toast', () => ({
    useToast: () => ({
      toast: jest.fn(),
    }),
  }));
  
  describe('AddProductForm', () => {
    it('submits the form with valid data', async () => {
      render(<AddProductForm />);
      const mockHandleServerAction = jest.fn(async (data) => ({ success: true }));

      jest.mock('@/app/actions/actions', () => ({
        handleServerAction: mockHandleServerAction,
      }));
      // Mock server action function (handleServerAction)
      const name = faker.commerce.productName();
      const description = faker.lorem.words();
      const price = faker.number.toString();
  
      // Fill out the form
      fireEvent.change(screen.getByPlaceholderText('product name'), {
        target: { value: name },
      });
      fireEvent.change(screen.getByPlaceholderText('product description'), {
        target: { value: description },
      });
      fireEvent.change(screen.getByPlaceholderText('product price'), {
        target: { value: price },
      });
  
      fireEvent.click(screen.getByText('Submit'));
  
      await waitFor(() => {
        // Assert that handleServerAction was called with the correct data
        expect(mockHandleServerAction).toHaveBeenCalledWith({
          name,
          description,
          price,
        });
  
        // Assert that useRouter.push was called after successful submission
        expect(screen.getByText('Server Action Page')).toBeInTheDocument();
        expect(screen.getByText('Server Action Page')).toHaveTextContent('Server Action Page');
      });
    });
  
    it('shows error message for invalid form data', async () => {
      render(<AddProductForm />);
      const mockHandleServerAction = jest.fn(async (data) => ({ success: true }));

      jest.mock('@/app/actions/actions', () => ({
        handleServerAction: mockHandleServerAction,
      }));
      const mockToast = jest.fn();
      jest.mock('@/components/ui/use-toast', () => ({
        useToast: () => ({
          toast: mockToast,
        }),
      }));
  
      // Fill out the form with invalid data (empty fields)
      fireEvent.click(screen.getByText('Submit'));
  
      await waitFor(() => {
        // Assert that toast function was called with the error message
        expect(mockToast).toHaveBeenCalledWith({
          variant: 'destructive',
          description: expect.stringContaining('name: required, description: required, price: required'),
        });
  
        // Assert that handleServerAction was not called
        expect(mockHandleServerAction).not.toHaveBeenCalled();
      });
    });
  });