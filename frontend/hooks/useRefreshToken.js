import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await fetch("http://localhost:5000/auth/refresh", {
            method: "GET",
            credentials: "include", // Ensures cookies are included in the request
        });

        if (!response.ok) {
            throw new Error("Failed to refresh token");
        }

        const data = await response.json();

        setAuth(prev => ({
            ...prev,
            // roles: data.roles,
            accessToken: data.accessToken,
        }));

        return data.accessToken;
    };

    return refresh;
};

export default useRefreshToken;
