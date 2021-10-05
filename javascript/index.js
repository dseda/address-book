const contacts = [];

class Contact {
  constructor(fname, lname, phone, address) {
    this.fname = fname;
    this.lname = lname;
    this.phone = phone;
    this.address = address;
  }

  get fullName() {
    return this.fname + " " + this.lname;
  }
}

const createNewContact = (firstName, lastName, phone, address) => {
  const contact = new Contact(firstName, lastName, phone, address);
  contacts.push(contact);
  return contact;
};

$("#new-contact").on("submit", function (event) {
  event.preventDefault();
  let firstName = $(this).find("[name=first-name]").val();
  let lastName = $(this).find("[name=last-name]").val();
  let phone = $(this).find("[name=phone]").val();
  let address = $(this).find("[name=address]").val();
  const contact = createNewContact(firstName, lastName, phone, address);

  $("<p>")
    .addClass("contact-info")
    .data("contact", contact)
    .text(contact.fullName)
    .appendTo("#container");

  $(this).trigger("reset");
});

$("#cancel").click(function () {
  $("#new-contact").trigger("reset");
});

$("p").on("click", function () {
  let selectedContact = $(this);
  // .data("contact");
  console.log(selectedContact);
  $("<div>")
    .addClass("contact-detail")
    .text(
      selectedContact
      // selectedContact.fname +
      //   " " +
      //   selectedContact.lname +
      //   " " +
      //   selectedContact.phone +
      //   " " +
      //   selectedContact.address
    )
    .appendTo("#container");
});

console.log(contacts);
