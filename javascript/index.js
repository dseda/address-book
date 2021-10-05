$().ready(function () {
  let contacts = [];
  let $allContacts = $("#all-contacts");
  let $createNewContact = $("#create-new-contact");
  let $info = $("#info");
  let $newContactBtn = $("#create-contact");
  let $myContacts = $("h1");
  let $container = $("#container");
  $container.empty();
  $createNewContact.hide();

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
    return contact;
  };

  //Add dummy data
  contacts.push(createNewContact("seda", "demir", "07722 334455", "London"));
  contacts.push(createNewContact("helen", "talbot", "07766 334455", "Reading"));

  const displayAllContacts = () => {
    $container.empty();
    for (let obj of contacts) {
      $("<button>")
        .text("delete")
        .addClass("delete")
        .prop("type", "button")
        .appendTo(
          $("<p>")
            .addClass("contact-info")
            .data("contact", obj)
            .text(obj.fullName + " " + obj.phone + " " + obj.address)
            .appendTo($container)
        );
    }
  };

  const toggleAllContacts = () => {
    if (contacts.length) {
      displayAllContacts();
      $info.hide();
    } else {
      $info
        .show()
        .addClass("nothing-found")
        .text("No contacts found")
        .appendTo("body");
      $allContacts.hide();
    }
  };

  toggleAllContacts();

  $newContactBtn.click(function () {
    $createNewContact.show();
  });

  $myContacts.click(function () {
    $("#new-contact").trigger("reset");
    $createNewContact.hide();
  });

  const add = (contact) => {
    $("<button>")
      .text("delete")
      .addClass("delete")
      .prop("type", "button")
      .appendTo(
        $("<p>")
          .addClass("contact-info")
          .data("contact", contact)
          .text(contact.fullName + " " + contact.phone + " " + contact.address)
          .appendTo($container)
      );
  };

  $("#new-contact").on("submit", function (event) {
    event.preventDefault();
    let firstName = $(this).find("[name=first-name]").val();
    let lastName = $(this).find("[name=last-name]").val();
    let phone = $(this).find("[name=phone]").val();
    let address = $(this).find("[name=address]").val();
    const contact = createNewContact(firstName, lastName, phone, address);
    contacts.push(contact);
    //Add newly created contact to All Contacts Section
    add(contact);
    //Empty form inputs
    $(this).trigger("reset");
  });

  $("#cancel").click(function () {
    $("#new-contact").trigger("reset");
    $createNewContact.hide();
  });

  $(document).on("click", ".delete", function () {
    let $deleteBtn = $(this);
    let contact = $deleteBtn.parent().data("contact");
    if (contacts.indexOf(contact !== -1)) {
      contacts = contacts.filter((item) => item.phone !== contact.phone);
    }
    displayAllContacts();
    console.log(contacts.length);
  });
});
