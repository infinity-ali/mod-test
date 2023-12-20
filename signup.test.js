import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import { BrowserRouter as Router, MemoryRouter } from "react-router-dom";
import { AuthContext } from "../../context/Auth.context"; // Import your AuthContext implementation
import SignupScreen from "./SignupScreen";

const mockAuthContextValues = {
  state: {},
  getUser: jest.fn(),
  signup: jest.fn(),
  updateUser: jest.fn(),
  setregistrationStatus: jest.fn(),
  sendCode: jest.fn(),
  sendCodeUpdate: jest.fn(),
};

const renderWithRouter = (component) => {
  return render(
    <Router>
      <AuthContext.Provider value={mockAuthContextValues}>
        {component}
      </AuthContext.Provider>
    </Router>,
  );
};

describe("SignupScreen Component", () => {
  it("renders without crashing", () => {
    renderWithRouter(<SignupScreen />);
    expect(screen.getByText("Previous and Next methods")).toBeInTheDocument();
  });

  it("submits the form with valid input", async () => {
    renderWithRouter(<SignupScreen />);

    const createAccountButton = screen.getByText("Create Account");

    userEvent.type(screen.getByLabelText("First Name"), "John");
    userEvent.type(screen.getByLabelText("Last Name"), "Doe");
    userEvent.type(screen.getByLabelText("Mobile Number"), "1234567890");
    userEvent.type(screen.getByLabelText("Email"), "john.doe@example.com");
    userEvent.type(screen.getByLabelText("ID"), "123456789");
    userEvent.type(screen.getByLabelText("Company Name"), "ABC Corp");
    userEvent.type(screen.getByLabelText("Company ID"), "54321");
    userEvent.click(screen.getByLabelText("I agree to the privacy policy"));

    fireEvent.click(createAccountButton);

    await waitFor(() => {
      expect(mockAuthContextValues.signup).toHaveBeenCalledWith(
        {
          firstName: "John",
          lastName: "Doe",
          mobile: "1234567890",
          email: "john.doe@example.com",
          userId: "123456789",
          cName: "ABC Corp",
          cId: "54321",
          tenderAlerts: true,
          privacyPolicy: true,
        },
        expect.any(Function),
      );
    });
  });
});
