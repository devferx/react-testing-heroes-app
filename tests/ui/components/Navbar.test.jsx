import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AuthContext } from "../../../src/auth/context/AuthContext";
import { Navbar } from "../../../src/ui/components/Navbar";

const mockedUseNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
}));

describe('Pruebas en <Navbar />', () => {
  const contextValue = {
    logged: true,
    user: {
      id: "123",
      name: "Juan"
    },
    logout: jest.fn()
  };

  beforeEach(() => jest.clearAllMocks());

  test('debe mostrar el nombre del usuario', () => {
    render(
      <MemoryRouter>
        <AuthContext.Provider value={contextValue}>
          <Navbar />
        </AuthContext.Provider>
      </MemoryRouter>
    );

    expect(screen.getByText(contextValue.user.name)).toBeInTheDocument();
  });

  test("deberia de llamar el logout y navigate cuando se hace click en el boton", () => {
    render(
      <AuthContext.Provider value={contextValue}>
        <MemoryRouter>
          <Navbar />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    const logoutBtn = screen.getByRole("button");
    fireEvent.click(logoutBtn);

    expect(contextValue.logout).toHaveBeenCalled();
    expect(mockedUseNavigate).toHaveBeenCalledWith("/login", {"replace": true});
  });
});