document.addEventListener("DOMContentLoaded", () => {
  // System Information
  let osInfo = {
    userAgent: navigator.userAgent,
    platform: navigator.platform,
    language: navigator.language,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    time: new Date().toLocaleString(),
  };

  // Save to LocalStorage
  localStorage.setItem("myInfo", JSON.stringify(osInfo));

  // Output in footer
  let footerInfo = document.getElementById("os-info");
  let savedData = localStorage.getItem("myInfo");

  if (savedData) {
    let info = JSON.parse(savedData);
    footerInfo.innerHTML = `
            <p><strong>Browser:</strong> ${info.userAgent}</p>
            <p><strong>Platform:</strong> ${info.platform || "Unknown"}</p>
            <p><strong>Language:</strong> ${info.language}</p>
            <p><strong>Screen:</strong> ${info.screenWidth}x${info.screenHeight}</p>
        `;
  }

  // Load comments
  let commentsContainer = document.getElementById("comments-container");
  let variant = 8;

  fetch(`https://jsonplaceholder.typicode.com/posts/${variant}/comments`)
    .then((res) => res.json())
    .then((data) => {
      commentsContainer.innerHTML = "";
      data.forEach((item) => {
        let div = document.createElement("div");
        div.className = "comment";
        div.innerHTML = `
                    <p><b>${item.name}</b> (${item.email})</p>
                    <p>${item.body}</p>
                `;
        commentsContainer.appendChild(div);
      });
    })
    .catch((err) => {
      console.log(err);
      commentsContainer.innerHTML = "<p>Error loading feedback.</p>";
    });

  // Modal logic
  let modal = document.getElementById("feedback-modal");
  let closeBtn = document.getElementById("close-modal");

  // Show form after 1 minute
  setTimeout(() => {
    modal.style.display = "block";
  }, 60000);

  closeBtn.onclick = () => {
    modal.style.display = "none";
  };

  window.onclick = (e) => {
    if (e.target == modal) {
      modal.style.display = "none";
    }
  };

  // Theme toggle
  let themeToggle = document.getElementById("theme-toggle");

  function checkTimeForTheme() {
    let hour = new Date().getHours();
    // Day light mode, Night dark mode (from 07:00 to 21:00)
    if (hour >= 7 && hour < 21) {
      document.body.classList.remove("dark-mode");
      themeToggle.checked = false;
    } else {
      document.body.classList.add("dark-mode");
      themeToggle.checked = true;
    }
  }

  checkTimeForTheme();

  // Manual theme change
  themeToggle.addEventListener("change", function () {
    if (this.checked) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  });
});
