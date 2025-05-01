console.log("Squire Popup Script Loaded.");

document.addEventListener('DOMContentLoaded', function() {
  const loginButton = document.getElementById('loginButton');
  const statusElement = document.querySelector('p');

  // Check login status (placeholder)
  statusElement.textContent = "Status: Ready"; // Replace with actual status check

  loginButton.addEventListener('click', () => {
    statusElement.textContent = "Status: Logging in...";
    console.log("Login button clicked");
    // Trigger OAuth flow using chrome.identity.getAuthToken
    chrome.identity.getAuthToken({ interactive: true }, function(token) {
      if (chrome.runtime.lastError || !token) {
        console.error("Login failed:", chrome.runtime.lastError);
        statusElement.textContent = "Status: Login failed";
      } else {
        console.log("Login successful, token:", token);
        statusElement.textContent = "Status: Logged In";
        loginButton.textContent = "Logged In";
        loginButton.disabled = true;
        // TODO: Use token to get user info or make API calls
      }
    });
  });
}); 