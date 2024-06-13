// // Function to generate a random string (you can customize it as per your requirement)
// const generateRandomString = () => {
//     // Generate a random string using any desired method (e.g., Math.random(), crypto.randomBytes(), etc.)
//     // Example:
//     const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
//     return randomString;
// };

// // Function to generate a new API key dynamically
// export const generateApiKey = () => {
//     // Generate a random API key here (you can use any method to generate a unique string)
//     const apiKey = generateRandomString();
//     return apiKey;
// };

// export default generateApiKey;

// // Function to generate a new API key dynamically
export function generateApiKey  () {
    // Generate a random API key here (you can use any method to generate a unique string)
    const apiKey = generateRandomString();
    return apiKey;
};

// Function to generate a random string (you can customize it as per your requirement)
const generateRandomString = () => {
    // Generate a random string using any desired method (e.g., Math.random(), crypto.randomBytes(), etc.)
    // Example:
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    return randomString;
};
