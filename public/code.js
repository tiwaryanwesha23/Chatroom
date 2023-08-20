(function () {
  const app = document.querySelector(".app");
  const socket = io();

  let uname;
  let currentDate = null;
  let selectedTheme = "theme1"; // Default theme

  // Function to change the theme of the chat background
  function changeTheme(theme) {
    const messageContainer = app.querySelector(".chat-screen .messages");
    messageContainer.classList.remove("theme1", "theme2", "theme3", "theme4"); // Remove all themes
    messageContainer.classList.add(theme); // Add the selected theme
  }

  // Add event listener to show theme selection screen
  app.querySelector(".join-screen #join-user").addEventListener("click", function () {
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".theme-selection-screen").classList.add("active");
  });

  // Add event listener to select a theme and join the chat
  app.querySelector("#select-theme").addEventListener("click", function () {
    selectedTheme = document.querySelector('input[name="theme"]:checked').value;
    changeTheme(selectedTheme);
    joinChat(selectedTheme);
  });

  // Function to join the chat after selecting a theme
  function joinChat(theme) {
    let username = app.querySelector(".join-screen #username").value;
    if (username.length == 0) {
      return;
    }
    socket.emit("newuser", username);
    uname = username;

    // Apply theme background image
    applyThemeBackground(theme);

    app.querySelector(".theme-selection-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");
  }

  // Function to apply the selected theme's background image
  function applyThemeBackground(theme) {
    let themeImageURL = ""; // Default empty URL

    // Determine the image URL based on the selected theme
if (theme === "theme1") {
  themeImageURL = "../img/bg1.jpg"; // Replace with actual URL for theme1
} else if (theme === "theme2") {
  themeImageURL = "../img/bg2.jpg"; // Replace with actual URL for theme2
} else if (theme === "theme3") {
  themeImageURL = "../img/bg3.jpg"; // Replace with actual URL for theme3
} else if (theme === "theme4") {
  themeImageURL = "../img/bg4.jpg"; // Replace with actual URL for theme4
}

    // Apply the selected theme's background image
    document.querySelector(".chat-screen .messages").style.backgroundImage = `url(${themeImageURL})`;
  }

  const messageInput = app.querySelector(".chat-screen #message-input");

  app.querySelector(".chat-screen #send-message").addEventListener("click", function () {
    let message = messageInput.value;
    if (message.length == 0) {
      return;
    }
    const now = new Date();
    const formattedDate = now.toLocaleDateString();
    const formattedTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    renderMessage("my", {
      username: uname,
      text: message,
      date: formattedDate,
      time: formattedTime,
    });
    socket.emit("chat", {
      username: uname,
      text: message,
      date: formattedDate,
      time: formattedTime,
    });
    messageInput.value = "";
  });

  socket.on("update", function (update) {
    renderMessage("update", update);
  });

  socket.on("chat", function (message) {
    renderMessage("other", message);
  });

  function renderMessage(type, message) {
    let messageContainer = app.querySelector(".chat-screen .messages");
    if (type == "my" || type == "other") {
      if (message.date !== currentDate) {
        let dateElement = document.createElement("div");
        dateElement.className = "date";
        dateElement.textContent = message.date;
        messageContainer.appendChild(dateElement);
        currentDate = message.date;
      }

      let el = document.createElement("div");
      el.setAttribute("class", "message " + type + "-message");

      let contentContainer = document.createElement("div");
      contentContainer.className = "message-content";

      let messageText = document.createElement("div");
      messageText.className = "text";
      messageText.innerHTML = `
        <div class="name">${type == "my" ? "You" : message.username}</div>
        <div class="message-text">${message.text}</div>
        <div class="timestamp">${message.time}</div>
      `;

      contentContainer.appendChild(messageText);

      el.appendChild(contentContainer);

      messageContainer.appendChild(el);
    } else if (type == "update") {
      let el = document.createElement("div");
      el.setAttribute("class", "update");
      el.innerText = message;
      messageContainer.appendChild(el);
    }

    messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
  }

  // Add event listener to handle exit button click
  app.querySelector("#exit-button").addEventListener("click", function () {
    window.location.href = "/"; // Redirect to home page
  });


})();
