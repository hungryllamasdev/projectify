import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UserAuthForm } from "@/components/auth/user-auth-from";
import { signIn } from "next-auth/react";

// Mock next-auth
jest.mock("next-auth/react", () => ({
    signIn: jest.fn(),
}));

describe("User Authentication", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("calls signIn when clicking Google button", async () => {
        render(<UserAuthForm />);

        const googleButton = screen.getByRole("button", { name: /google/i });
        fireEvent.click(googleButton);

        expect(signIn).toHaveBeenCalledWith("google", {
            redirectTo: "/dashboard",
        });
    });
});
