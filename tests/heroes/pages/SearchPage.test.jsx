import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { SearchPage } from "../../../src/heroes/pages/SearchPage";

const mockedUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
}));

describe('Pruebas en <SearchPage />', () => {
  beforeEach(() => jest.clearAllMocks());

  test('debe de mostrarse correctamente con valores por defecto', () => {
    const { container } = render(
      <MemoryRouter>
        <SearchPage />
      </MemoryRouter>
    );

    expect(container).toMatchSnapshot();
  });

  test('debe de mostrar a Batman y el input con el valor del queryString', () => {
    render(
      <MemoryRouter initialEntries={["/search?q=batman"]}>
        <SearchPage />
      </MemoryRouter>
    );

    const input = screen.getByRole("textbox");
    expect(input.value).toBe("batman");

    const img = screen.getByAltText("Batman");
    expect(img.src).toContain("/assets/heroes/dc-batman.jpg");

    const alertDanger = screen.getByLabelText("alert-danger");
    expect(alertDanger).toHaveStyle("display: none");
  });

  test('debe de mostrar un error si no se encuentra el hero (batman123)', () => {
    render(
      <MemoryRouter initialEntries={["/search?q=batman123"]}>
        <SearchPage />
      </MemoryRouter>
    );

    const alertDanger = screen.getByLabelText("alert-danger");
    expect(alertDanger).not.toHaveStyle("display: none");
  });

  test('debe de llamar el navigate a la pantalla nueva', () => {
    const heroToSearch = "Flash";

    render(
      <MemoryRouter initialEntries={["/search"]}>
        <SearchPage />
      </MemoryRouter>
    );

    const searchInput = screen.getByPlaceholderText("Search a hero");
    const form = screen.getByRole("form");

    fireEvent.change(searchInput, { target: { value: heroToSearch } });
    fireEvent.submit(form);

    expect(mockedUseNavigate).toHaveBeenCalledWith(`?q=${heroToSearch}`);
  });
});