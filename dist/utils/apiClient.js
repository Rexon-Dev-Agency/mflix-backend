import axios from "axios";
export const apiClient = async (url, config) => {
    try {
        const response = await axios(url, config);
        return response.data;
    }
    catch (err) {
        throw new Error(err.response?.data?.message || "API request failed");
    }
};
//# sourceMappingURL=apiClient.js.map