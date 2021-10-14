$().ready(function () {
  let contacts = [];
  const $contacts = $("#contacts");
  const $modifyContacts = $("#modify-contacts");
  const $info = $("#info");
  const $newContactBtn = $("#create-new");
  const $contactsContainer = $("#container");
  const $tbody = $("tbody");
  const phoneRgx = /(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}/; //Reference https://regexlib.com/Search.aspx?k=uk%20telephone

  $modifyContacts.hide();

  class Contact {
    constructor(fname, lname, phone, address) {
      this._fname = fname;
      this._lname = lname;
      this._phone = phone;
      this._address = address;
    }
    get firstName() {
      return this._fname
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
    get lastName() {
      return this._lname
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
    get fullName() {
      return this.firstName + " " + this.lastName;
    }
    get phone() {
      return this._phone;
    }
    get address() {
      return this._address
        .split(" ")
        .map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        )
        .join(" ");
    }
    set updateFirstName(t) {
      this._fname = t;
    }
    set updateLastName(t) {
      this._lname = t;
    }
    set updatePhone(t) {
      this._phone = t;
    }
    set updateAddress(t) {
      this._address = t;
    }
  }

  const createNewContact = (firstName, lastName, phone, address) => {
    return new Contact(
      firstName.toLowerCase(),
      lastName.toLowerCase(),
      phone,
      address.toLowerCase()
    );
  };

  $("h1").click(function () {
    reset($contacts);
  });
  $("h2").click(function () {
    reset($contacts);
  });
  $newContactBtn.click(function () {
    $modifyContacts.find($("h3")).text("Create Contact");
    reset($modifyContacts);
    $("form").prop("id", "new");
  });

  $("#cancel").click(function () {
    reset($contacts);
  });

  const phoneFormatMsg = $("<p>")
    .addClass("tel")
    .text("Please enter a valid UK phone number");

  const validateForm = (f, l, phone, a) => {
    if (phoneRgx.test(phone)) {
      return true;
    } else {
      $("input[type='tel']").addClass("invalid");
      $("#tel").append(phoneFormatMsg);
      return false;
      //TODO: validate other user inputs
    }
  };

  const reset = (element) => {
    $("form").trigger("reset");
    $(".contact-info.editable").removeClass("editable");
    $("p.tel").remove();
    $("input[type='tel']").removeClass("invalid");
    $modifyContacts.hide();
    $contacts.hide();
    $info.hide();
    element.show();
  };
  const renderContact = (contact) => {
    let row = $("<tr>");
    let delButton = $("<a>")
      .addClass("delete")
      .append(
        $("<img>").attr(
          "src",
          "https://img.icons8.com/ios-filled/50/000000/delete-forever.png"
        )
      );

    let editButton = $("<a>")
      .addClass("edit")
      .append(
        $("<img>").attr(
          "src",
          "https://img.icons8.com/ios-filled/50/000000/edit--v1.png"
        )
      );
    row
      .addClass("contact-info")
      .append($("<td>").text(contact.firstName))
      .append($("<td>").text(contact.lastName))
      .append($("<td>").text(contact.phone))
      .append($("<td>").text(contact.address))
      .append($("<td>").append(editButton).append(delButton))
      .data("contact", contact);
    return row;
  };
  /////////////******** ADD NEW CONTACT *************////////
  $(document).on("submit", "form#new", function (event) {
    event.preventDefault();
    // Get user inputs
    let firstName = $(this).find("[name=first-name]").val().trim();
    let lastName = $(this).find("[name=last-name]").val().trim();
    let phone = $(this).find("[name=phone]").val().trim();
    let address = $(this).find("[name=address]").val().trim();
    // Validate form
    if (validateForm(firstName, lastName, phone, address)) {
      const contact = createNewContact(firstName, lastName, phone, address);
      contacts.push(contact);
      reset($contacts);
      $tbody.empty();
      displayContacts();
    }
  });

  ////////////********* DISPLAY ALL CONTACTS ********//////////

  const displayContacts = () => {
    if (!contacts.length) {
      $info.show().text("No contacts found");
    }
    contacts.sort(function (a, b) {
      var fNameA = a._fname;
      var fNameB = b._fname;
      if (fNameA < fNameB) {
        return -1;
      }
      if (fNameA > fNameB) {
        return 1;
      }
      return 0;
    });
    for (let c of contacts) {
      $tbody.append(renderContact(c));
    }
    $contacts.show();
  };

  /////////******** DELETE CONTACT *********///////////

  $(document).on("click", ".delete", function () {
    let $deleteBtn = $(this);
    let contact = $deleteBtn.parent().parent().data("contact");
    let userAnswer = window.confirm("Delete " + contact.fullName + " ?");

    if (contacts.indexOf(contact !== -1)) {
      contacts = contacts.filter((item) => item.phone !== contact._phone);
    }
    if (userAnswer) {
      $deleteBtn.parent().parent().remove();
    }
    if (!contacts.length) {
      $info.show().text("No contacts found");
    }
    $("form").trigger("reset");
  });
  /////////******** SEARCH CONTACTS *********///////////

  $("#search").on("focusin change input click", function () {
    reset($contacts);
    let search = $("#search").val().trim().toLowerCase().split(" "); // get input as array
    if (!contacts.length) {
      $info.show().text("No contacts found");
    } else if (search == "") {
      $tbody.empty();
      displayContacts();
    } else if ($tbody.children()) {
      $tbody.empty();
      for (let contact of contacts) {
        if (
          search.every((element) => {
            return Object.values(contact).includes(element);
          })
        ) {
          $tbody.append(renderContact(contact));
        }
      }
    } else {
      $tbody.empty();
      $info.show().text(search.join(" ") + " not found");
    }
  });
  $("#search").on("focusout", function () {
    let search = $("#search");
    search.val("");
    $tbody.empty();
    displayContacts();
  });

  /////////******** EDIT CONTACT *********///////////
  $(document).on("click", ".edit", function () {
    $contacts.hide();
    $modifyContacts.find($("h3")).text("Edit Contact");
    $(".contact-info.editable").removeClass("editable");
    let row = $(this).parent().parent();
    row.addClass("editable");
    row.data("contact");
    $("form").prop("id", "edit");
    let $editForm = $("form#edit");
    let contact = row.data("contact");
    console.log($editForm);
    //Populate contact info
    $editForm.find("[name=first-name]").val(contact.firstName);
    $editForm.find("[name=last-name]").val(contact.lastName);
    $editForm.find("[name=phone]").val(contact.phone);
    $editForm.find("[name=address]").val(contact.address);
    $modifyContacts.show();
  });
  $(document).on("submit", "form#edit", function (event) {
    event.preventDefault();
    let contact = $(".contact-info.editable").data("contact");
    let index = contacts.indexOf(contact);
    //Validate form and update contact info
    if (
      validateForm(
        contact._fname,
        contact._lname,
        contact._phone,
        contact._address
      )
    ) {
      contacts[index].updateFirstName = $(this)
        .find("[name=first-name]")
        .val()
        .toLowerCase();
      contacts[index].updateLastName = $(this)
        .find("[name=last-name]")
        .val()
        .toLowerCase();
      contacts[index].updatePhone = $(this)
        .find("[name=phone]")
        .val()
        .toLowerCase();
      contacts[index].updateAddress = $(this)
        .find("[name=address]")
        .val()
        .toLowerCase();
      $tbody.empty();
      reset($contacts);
      displayContacts();
    }
  });

  //Add dummy data
  let c1 = createNewContact("s", "demir", "07701000000", "london");
  let c2 = createNewContact("helen", "talbot", "07702000001", "reading");
  let c3 = createNewContact("jake", "talbot", "07703000002", "sussex");
  let c4 = createNewContact("helen", "Lipa", "07704000003", "London");
  let c5 = createNewContact("John", "Resig", "07704000004", "New York");
  contacts.push(c1);
  contacts.push(c2);
  contacts.push(c3);
  contacts.push(c4);
  contacts.push(c5);
  displayContacts();
});
