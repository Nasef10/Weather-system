// Array to store users
const users = JSON.parse(localStorage.getItem("users")) || [];

// Register function
function register() {
  const name = document.getElementById("regName").value.trim();
  const email = document.getElementById("regEmail").value.trim();
  const password = document.getElementById("regPassword").value.trim();
  const confirmPassword = document.getElementById("regConfirmPassword").value.trim();

  // Basic validation
  if (!name || !email || !password || !confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'All fields are required!',
    });
    return;
  }

  // Validate email format
  if (!/\S+@\S+\.\S+/.test(email)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Email',
      text: 'Please enter a valid email address!',
    });
    return;
  }

  // Check if email already exists
  if (users.some((user) => user.email === email)) {
    Swal.fire({
      icon: 'warning',
      title: 'Email Exists',
      text: 'This email is already registered!',
    });
    return;
  }

  // Password validation (e.g., minimum length, uppercase, number)
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
  if (!passwordRegex.test(password)) {
    Swal.fire({
      icon: 'error',
      title: 'Weak Password',
      text: 'Password must be at least 6 characters long and contain a mix of letters, numbers, and special characters.',
    });
    return;
  }

  // Password and confirm password match
  if (password !== confirmPassword) {
    Swal.fire({
      icon: 'error',
      title: 'Password Mismatch',
      text: 'Passwords do not match!',
    });
    return;
  }

  // Add user to array and save to localStorage
  users.push({ name, email, password });
  localStorage.setItem("users", JSON.stringify(users));
  Swal.fire({
    icon: 'success',
    title: 'Registered!',
    text: 'Redirecting to Login...',
    timer: 2000,
    showConfirmButton: false,
  }).then(() => {
    window.location.href = "index.html";
  });
}

// Login function
function login() {
  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  // Validate login fields
  if (!email || !password) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Both fields are required!',
    });
    return;
  }

  // Validate email format
  if (!/\S+@\S+\.\S+/.test(email)) {
    Swal.fire({
      icon: 'error',
      title: 'Invalid Email',
      text: 'Please enter a valid email address!',
    });
    return;
  }

  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    Swal.fire({
      icon: 'error',
      title: 'Login Failed',
      text: 'Invalid email or password!',
    });
    return;
  }

  // Save current user to localStorage
  localStorage.setItem("currentUser", JSON.stringify(user));
  Swal.fire({
    icon: 'success',
    title: 'Login Successful!',
    text: 'Redirecting to Home page...',
    timer: 2000,
    showConfirmButton: false,
  }).then(() => {
    window.location.href = "home.html";
  });
}

// Logout function
function logout() {
  Swal.fire({
    icon: 'question',
    title: 'Are you sure?',
    text: 'You will be logged out.',
    showCancelButton: true,
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'Cancel',
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("currentUser");
      Swal.fire({
        icon: 'success',
        title: 'Logged Out',
        text: 'You have been logged out successfully.',
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        window.location.href = "index.html";
      });
    }
  });
}

// Protect Home Page
if (window.location.pathname.includes("home.html")) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    window.location.href = "index.html";
  } else {
    document.getElementById("userName").textContent = currentUser.name;
  }
}
