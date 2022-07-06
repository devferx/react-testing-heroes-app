import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import { HeroPage } from '../../../src/heroes/pages/HeroPage';

const mockedUseNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUseNavigate,
}));

describe('Pruebas en <HeroPage />', () => {
  beforeEach(() => jest.clearAllMocks());

  test('Debe de mostrar un heroe', () => {
    render(
      <MemoryRouter initialEntries={["/hero/marvel-captain"]}>
        <Routes>
          <Route path='/hero/:id' element={<HeroPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Captain America")).toBeInTheDocument();
  });

  test('Debe de ir a la pagina de marvel cuando no hay un heroe', () => {
    render(
      <MemoryRouter initialEntries={["/hero/batmen123"]}>
        <Routes>
          <Route path='/hero/:id' element={<HeroPage />} />
          <Route path='/marvel' element={<h1>Marvel Comics</h1>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Marvel Comics")).toBeInTheDocument();
  });

  test('debe regresar a la pagina anterior', () => {
    render(
      <MemoryRouter initialEntries={["/hero/marvel-captain"]}>
        <Routes>
          <Route path='/hero/:id' element={<HeroPage />} />
        </Routes>
      </MemoryRouter>
    );

    const button = screen.getByText("Regresar");
    fireEvent.click(button);

    expect(mockedUseNavigate).toHaveBeenCalledWith(-1);
  });
});