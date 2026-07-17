var imginput = document.getElementById("imgInput");
var nameinput = document.getElementById("nameInput");
var phoneinput = document.getElementById("phoneInput");
var emailinput = document.getElementById("emailInput");
var addressinput = document.getElementById("addressInput");
var groupinput = document.getElementById("group-select");
var noteinput = document.getElementById("notes");
var fav = document.getElementById("fav");
var emergency = document.getElementById("emergency");
var cardContainer = document.getElementById("card-container");
var modaloverlay = document.querySelector(".modal-overlay");
var searchinput = document.getElementById("searchInput");
var stattotal = document.getElementById("stat-total");
var statfavorites = document.getElementById("stat-favorites");
var statemergency = document.getElementById("stat-emergency");
var pagesubtitle = document.querySelector(".page-subtitle");
var favcard = document.getElementById("fav-card");
var emergencycard = document.getElementById("emergency-card");
var modaltitle = document.querySelector(".modal-title");

var avatarColors = [
  "avatar-blue",
  "avatar-teal",
  "avatar-purple",
  "avatar-rose",
];

var contacts = JSON.parse(localStorage.getItem("contact")) || [];
rendercard();
updateSubtitle();
updateStats();
renderfavs();
renderemergency();

/* image helper functions */

function getInitials(fullName) {
  var parts = fullName.trim().split(" ");
  var first = parts[0] ? parts[0].charAt(0).toUpperCase() : "";
  var second = parts[1] ? parts[1].charAt(0).toUpperCase() : "";
  return first + second;
}

function getRandomAvatarColor() {
  var randomIndex = Math.floor(Math.random() * avatarColors.length);
  return avatarColors[randomIndex];
}

/* add functions */

function openForm() {
  modaloverlay.classList.remove("d-none");
  currentIndex = undefined;
  modaltitle.textContent = "Add New Contact";
}

function closeForm() {
  modaloverlay.classList.add("d-none");
}

function addcard() {
  var imageName = imginput.files.length > 0 ? imginput.files[0].name : "";

  var contact = {
    image: imageName ? "./assets/images/" + imageName : "",
    initials: getInitials(nameinput.value),
    avatarColor: getRandomAvatarColor(),
    name: nameinput.value,
    phone: phoneinput.value,
    email: emailinput.value,
    address: addressinput.value,
    group: groupinput.value,
    note: noteinput.value,
    favorite: fav.checked,
    emergency: emergency.checked,
  };

  contacts.push(contact);
  rendercard();
  localStorage.setItem("contact", JSON.stringify(contacts));
  clearform();
  currentIndex = undefined;
  closeForm();
  updateSubtitle();
  updateStats();
  renderfavs();
  renderemergency();
}

function clearform() {
  imginput.value = "";
  nameinput.value = "";
  phoneinput.value = "";
  emailinput.value = "";
  addressinput.value = "";
  groupinput.value = "Select a group";
  noteinput.value = "";
  fav.checked = false;
  emergency.checked = false;
}

/* build card */

function buildCardHtml(contact, i) {
  var avatarHtml = contact.image
    ? `<img src="${contact.image}" alt="${contact.name}" class="avatar-img" />`
    : `<div class="avatar ${contact.avatarColor}">${contact.initials}</div>`;

  return `<div class="col">
    <div class="contact-card">
      <div class="card-top">
        <div class="d-flex align-items-center gap-3 mb-3">
          <div class="avatar-wrap position-relative">
            ${avatarHtml}
            ${contact.favorite ? `<span class="badge-icon badge-star"><i class="fa-solid fa-star"></i></span>` : ""}
            ${contact.emergency ? `<span class="badge-icon badge-heart"><i class="fa-solid fa-heart-pulse"></i></span>` : ""}
          </div>
          <div>
            <h3 class="contact-name mb-1">${contact.name}</h3>
            <div class="contact-line">
              <span class="icon-chip icon-chip-blue"><i class="fa-solid fa-phone"></i></span>
              <span>${contact.phone}</span>
            </div>
          </div>
        </div>

        <div class="extra-info">
          ${
            contact.email
              ? `<div class="contact-line mb-2">
            <span class="icon-chip icon-chip-purple"><i class="fa-solid fa-envelope"></i></span>
            <span>${contact.email}</span>
          </div>`
              : ""
          }

          ${
            contact.address
              ? `<div class="contact-line mb-3">
            <span class="icon-chip icon-chip-green"><i class="fa-solid fa-location-dot"></i></span>
            <span>${contact.address}</span>
          </div>`
              : ""
          }
        </div>

        <div class="d-flex gap-2 mb-3 tags-row">
          ${contact.group !== "Select a group" ? `<span class="tag ${getGroupClass(contact.group)}">${contact.group}</span>` : ""}
          ${contact.emergency ? `<span class="tag tag-rose"><i class="fa-solid fa-heart-pulse"></i> Emergency</span>` : ""}
        </div>
      </div>

      <div class="d-flex align-items-center justify-content-between contact-actions">
        <div class="d-flex gap-2">
          <a href="tel:${contact.phone}" class="action-btn action-btn-green"><i class="fa-solid fa-phone"></i></a>
          ${contact.email ? `<a href="mailto:${contact.email}" class="action-btn action-btn-purple"><i class="fa-solid fa-envelope"></i></a>` : ""}
        </div>
        <div class="d-flex gap-2">
          <button class="action-btn ${contact.favorite ? "fav-button" : "action-btn-gray2"} action-btn-star" onclick="togglefavorite(${i})">
            <i class="fa-${contact.favorite ? "solid" : "regular"} fa-star"></i>
          </button>
          <button class="action-btn ${contact.emergency ? "emergency-button" : "action-btn-gray2"} action-btn-heart" onclick="toggleemergency(${i})">
            <i class="fa-${contact.emergency ? "solid fa-heart-pulse" : "regular fa-heart"}"></i>
          </button>
          <button class="action-btn action-btn-gray action-btn-pen" onclick="returndata(${i})"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn action-btn-gray action-btn-trash" onclick="deletecard(${i})"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    </div>
  </div>`;
}

/* display functions */

function rendercard() {
  var box = "";
  for (var i = 0; i < contacts.length; i++) {
    box += buildCardHtml(contacts[i], i);
  }

  if (contacts.length === 0) {
    cardContainer.classList.add("empty-container");
    box = `<div class="empty-state d-flex flex-column align-items-center justify-content-center">
      <div class="empty-icon d-flex align-items-center justify-content-center">
        <i class="fa-solid fa-address-book"></i>
      </div>
      <p class="empty-title mb-1">No contacts found</p>
      <p class="empty-subtitle mb-0">Click "Add Contact" to get started</p>
    </div>`;
  } else {
    cardContainer.classList.remove("empty-container");
  }

  cardContainer.innerHTML = box;
}

/* delete functions */

function deletecard(index) {
  var contact = contacts[index];

  Swal.fire({
    title: "Delete Contact?",
    text: `Are you sure you want to delete ${contact.name}? This action cannot be undone.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      contacts.splice(index, 1);
      localStorage.setItem("contact", JSON.stringify(contacts));
      rendercard();
      updateSubtitle();
      updateStats();
      renderfavs();
      renderemergency();

      Swal.fire({
        title: "Deleted!",
        text: "The contact has been deleted.",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

/* update functions */
var currentIndex;
function returndata(index) {
  openForm();
  var contact = contacts[index];
  currentIndex = index;

  nameinput.value = contact.name;
  phoneinput.value = contact.phone;
  emailinput.value = contact.email;
  addressinput.value = contact.address;
  groupinput.value = contact.group;
  noteinput.value = contact.note;
  fav.checked = contact.favorite;
  emergency.checked = contact.emergency;

  modaltitle.textContent = "Edit Contact";
}

function updatedata() {
  var imageName = imginput.files.length > 0 ? imginput.files[0].name : "";
  var oldContact = contacts[currentIndex];
  var contact = {
    image: imageName ? "./assets/images/" + imageName : oldContact.image,
    initials: getInitials(nameinput.value),
    avatarColor: oldContact.avatarColor,
    name: nameinput.value,
    phone: phoneinput.value,
    email: emailinput.value,
    address: addressinput.value,
    group: groupinput.value,
    note: noteinput.value,
    favorite: fav.checked,
    emergency: emergency.checked,
  };
  contacts.splice(currentIndex, 1, contact);
  localStorage.setItem("contact", JSON.stringify(contacts));

  rendercard();
  clearform();
  currentIndex = undefined;
  closeForm();
  updateSubtitle();
  updateStats();
  renderfavs();
  renderemergency();
}

/* check update or delete */

function savecontact() {
  if (nameinput.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Name",
      text: "Please enter a name for the contact!",
    });
    return;
  }

  if (!validatename()) {
    Swal.fire({
      icon: "error",
      title: "Invalid Name",
      text: "Name should contain only letters and spaces (2-50 characters)",
    });
    return;
  }

  if (phoneinput.value.trim() === "") {
    Swal.fire({
      icon: "error",
      title: "Missing Phone Number",
      text: "Please enter a phone number for the contact!",
    });
    return;
  }

  if (!validatephone()) {
    Swal.fire({
      icon: "error",
      title: "Invalid Phone",
      text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
    });
    return;
  }

  var duplicateContact = getDuplicatePhoneContact(phoneinput.value.trim());

  if (duplicateContact) {
    Swal.fire({
      icon: "error",
      title: "Duplicate Phone Number",
      text: `A contact with this phone number already exists: ${duplicateContact.name}`,
    });
    return;
  }

  if (!validateemail()) {
    Swal.fire({
      icon: "error",
      title: "Invalid Email",
      text: "Please enter a valid email address, or leave it empty.",
    });
    return;
  }

  var isUpdate = currentIndex !== undefined && currentIndex !== null;

  if (!isUpdate) {
    addcard();
  } else {
    updatedata();
  }

  Swal.fire({
    icon: "success",
    title: isUpdate ? "Updated!" : "Added!",
    text: isUpdate
      ? "Contact has been updated successfully."
      : "Contact has been added successfully.",
    timer: 1500,
    showConfirmButton: false,
  });
}

/* search functions */
function search() {
  var term = searchinput.value.trim().toLowerCase();
  var box = "";

  for (var i = 0; i < contacts.length; i++) {
    var contact = contacts[i];
    if (
      contact.name.toLowerCase().includes(term) ||
      contact.email.toLowerCase().includes(term) ||
      contact.phone.toLowerCase().includes(term)
    ) {
      box += buildCardHtml(contact, i);
    }
  }

  if (box === "") {
    cardContainer.classList.add("empty-container");
    box = `<div class="empty-state d-flex flex-column align-items-center justify-content-center">
      <div class="empty-icon d-flex align-items-center justify-content-center">
        <i class="fa-solid fa-address-book"></i>
      </div>
      <p class="empty-title mb-1">No contacts found</p>
      <p class="empty-subtitle mb-0">Try a different search term</p>
    </div>`;
  } else {
    cardContainer.classList.remove("empty-container");
  }

  cardContainer.innerHTML = box;
}

/* switching icons */

function togglefavorite(index) {
  contacts[index].favorite = !contacts[index].favorite;
  localStorage.setItem("contact", JSON.stringify(contacts));
  rendercard();
  renderfavs();
  updateStats();
}

function toggleemergency(index) {
  contacts[index].emergency = !contacts[index].emergency;
  localStorage.setItem("contact", JSON.stringify(contacts));
  rendercard();
  renderemergency();
  updateStats();
}

/* group tag color */

function getGroupClass(group) {
  switch (group) {
    case "Friends":
      return "tag-green";
    case "Work":
      return "tag-violet";
    case "Family":
      return "tag-blue";
    case "School":
      return "tag-yellow";
    default:
      return "tag-gray";
  }
}

/* update static numbers */

function updateSubtitle() {
  pagesubtitle.textContent = `Manage and organize your ${contacts.length} contacts`;
}

function updateStats() {
  var favCount = 0;
  var emergencyCount = 0;

  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].favorite) {
      favCount++;
    }
    if (contacts[i].emergency) {
      emergencyCount++;
    }
  }

  stattotal.textContent = `${contacts.length}`;
  statfavorites.textContent = `${favCount}`;
  statemergency.textContent = `${emergencyCount}`;
}

/* add to favourite */
function renderfavs() {
  var box = "";
  for (var i = 0; i < contacts.length; i++) {
    var contact = contacts[i];
    if (contact.favorite) {
      var avatarHtml = contact.image
        ? `<img src="${contact.image}" alt="${contact.name}" class="side-avatar" />`
        : `<div class="side-avatar avatar-sm ${contact.avatarColor}">${contact.initials}</div>`;

      box += `<div class="col">
      <div class="side-card-body fav-side-card d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
          ${avatarHtml}
          <div>
            <p class="side-name mb-0">${contact.name}</p>
            <p class="side-phone mb-0">${contact.phone}</p>
          </div>
        </div>
        <a href="tel:${contact.phone}" class="action-btn-green-side">
          <i class="fa-solid fa-phone"></i>
        </a>
      </div>
      </div>`;
    }
  }

  if (box === "") {
    box = `<p class="empty-side-text text-center mb-0">No favorites yet</p>`;
  }

  favcard.innerHTML = box;
}

/* add to emergency */
function renderemergency() {
  var box = "";
  for (var i = 0; i < contacts.length; i++) {
    var contact = contacts[i];
    if (contact.emergency) {
      var avatarHtml = contact.image
        ? `<img src="${contact.image}" alt="${contact.name}" class="side-avatar avatar-sm" />`
        : `<div class="side-avatar avatar-sm ${contact.avatarColor}">${contact.initials}</div>`;

      box += `<div class="col">
      <div class="side-card-body emer-side-card d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center gap-3">
          ${avatarHtml}
          <div>
            <p class="side-name mb-0">${contact.name}</p>
            <p class="side-phone mb-0">${contact.phone}</p>
          </div>
        </div>
        <a href="tel:${contact.phone}" class="action-btn-red-side">
          <i class="fa-solid fa-phone"></i>
        </a>
      </div>
      </div>`;
    }
  }

  if (box === "") {
    box = `<p class="empty-side-text text-center mb-0">No emergency contacts</p>`;
  }

  emergencycard.innerHTML = box;
}

/* validation */

function validateField(inputEl, errorEl, pattern, requiredIfEmpty) {
  var value = inputEl.value;

  if (value === "") {
    errorEl.classList.add("d-none");
    inputEl.classList.remove("input-error");
    return !requiredIfEmpty; // true if optional, false if required
  } else if (pattern.test(value)) {
    errorEl.classList.add("d-none");
    inputEl.classList.remove("input-error");
    return true;
  } else {
    errorEl.classList.remove("d-none");
    inputEl.classList.add("input-error");
    return false;
  }
}

var errorname = document.querySelector(".name-error");
var errorphone = document.querySelector(".phone-error");
var erroremail = document.querySelector(".email-error");

var namePattern = /^[A-Za-z\s]{2,50}$/;
var phonePattern = /^01[0125][0-9]{8}$/;
var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validatename() {
  return validateField(nameinput, errorname, namePattern, true); // required
}

function validatephone() {
  return validateField(phoneinput, errorphone, phonePattern, true); // required
}

function validateemail() {
  return validateField(emailinput, erroremail, emailPattern, false); // optional
}

/* check repeated number */

function getDuplicatePhoneContact(phone) {
  for (var i = 0; i < contacts.length; i++) {
    if (contacts[i].phone === phone && i !== currentIndex) {
      return contacts[i];
    }
  }
  return null;
}
