import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import LandingPage from "@/app/(app)/page";

describe("Landing Page", () => {
    it("renders a heading", () => {
        render(<LandingPage />);

        const heading = screen.getByRole("heading", { level: 1 });

        expect(heading).toBeInTheDocument();
    });
});

