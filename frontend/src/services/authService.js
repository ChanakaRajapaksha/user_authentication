// const API_URL = 'https://back-his.quortech-technologies.com';
export const loginUserService = async (username, password, branch) => {
    const response = await fetch('http://localhost:5000/auth/login', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, branch }),
        credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
        const error = new Error(data.message || "Login failed");
        error.status = response.status;
        throw error;
    }

    return data;
};

// export const fetchUserRoleData = async (accessToken, role) => {
//     try {
//         const endpoint = role === 'admin' ? '/api/dashboard' : '/api/doctor';
//         const response = await fetch(`${API_URL}${endpoint}`, {
//             method: "GET",
//             headers: {
//                 Authorization: `Bearer ${accessToken}`,
//             },
//         });

//         if (!response.ok) {
//             throw new Error('Access denied or unexpected role');
//         }

//         const data = await response.json();
//         return data;
//     } catch (error) {
//         throw new Error(error.message || 'Failed to fetch role data');
//     }
// };

export const registerUser = async (username, email, password) => {
    try {
        const response = await fetch('http://localhost:5000/auth/register', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await response.json();

        // if (!response.ok) {
        //     throw new Error(data.message || 'Login failed');
        // }

        return { response, data };
    } catch {
        throw new Error(error.message || 'An error occurred while registration')
    }
}

export const forgotPassword = async (email) => {
    try {
        const response = await fetch('http://localhost:5000/auth/forgot-password', {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        return { response, data };
    } catch {
        throw new Error(error.message || "Error during password reset");
    }
}

export const resetPassword = async (resetToken, newPassword) => {
    try {
        const response = await fetch(`http://localhost:5000/auth/reset-password/${resetToken}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newPassword }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error resetting password');
        }

        return data;
    } catch (error) {
        throw new Error(error.message || 'Something went wrong during password reset');
    }
}

export const logoutUser = async () => {
    try {
        const response = await fetch('http://localhost:5000/auth/logout', {
            method: "GET",
            credentials: "include",
        });

        if (!response.ok) {
            throw new Error("Logout failed.");
        }

        return response;
    } catch (error) {
        throw new Error(error.message || "An error occurred during logout.");
    }
}