document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // Adding eventListener for the submit button to send an email
  // Changed to call fetch_email directly from the button element
  // document.querySelector('#submit-button').addEventListener('click', fetch_email);
  
  // By default, load the inbox
  load_mailbox('inbox');
});

// No improvements necssary - done!
function compose_email() {
  // This function is finished and works.
  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  // New div added to view an email
  document.querySelector('#view-myemail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Reset title to New Mail
  document.querySelector('#compose-view-title').innerHTML = 'New Mail';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
   // New div added to view an email
   document.querySelector('#view-myemail').style.display = 'none';

  // Show the mailbox name. See commented items as it was before I changed it so I could reference mailbox name later
  const mailbox_name = `${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}`;
  document.querySelector('#email-views-title').innerHTML = mailbox_name;
  // document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;
  
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      
    build_inbox(emails);
    
  });
}

function fetch_email(){
    // This function saves the email from the compose-view
    // Get the composition fields
    // Set the onSubmit to return false keeping this window open
    const recipients = document.querySelector('#compose-recipients').value;
    const subject = document.querySelector('#compose-subject').value;
    const body = document.querySelector('#compose-body').value;

    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: recipients,
          subject: subject,
          body: body
      })
    })
    .then(response => response.json())
    .then(result => { 
      if (result.error){
        show_mymessage(result.error);
      } else {
        show_mymessage('Email sent.');
      }
    });
}

function build_inbox(emails){

  // Need to clear out previous list of emails
  const tbl = document.querySelector('#inbox-table');
  if (tbl){
    tbl.parentNode.removeChild(tbl);
  }
  // Get reference to email-views div so I can append table inside.
  const div_emails_view = document.getElementById('emails-view');
  // Need one table, table head outside of loop with it's headings
  const table = document.createElement('table');
  // Style table as per Bootstrap hover
  table.className = 'table table-hover';
  table.id = 'inbox-table'
  const thead = document.createElement('thead');


  // Add table to emails-view
  div_emails_view.appendChild(table);
  // Add thead to table
  table.appendChild(thead);
  // Add trow to thead. Still in header of table
  const trow = document.createElement('tr');
  thead.appendChild(trow);

  // Next elements will be in header of table
  const th_recipients = document.createElement('th');
  th_recipients.scope = 'col';
  th_recipients.innerHTML = 'Recipient(s)';
  trow.appendChild(th_recipients);

  const th_subject = document.createElement('th');
  th_subject.scope = 'col';
  th_subject.innerHTML = 'Subject';
  trow.appendChild(th_subject);

  const th_datetime = document.createElement('th');
  th_datetime.scope = 'col';
  th_datetime.innerHTML = 'Date/Time';
  trow.appendChild(th_datetime);

  const th_text = document.createElement('th');
  th_text.scope = 'col';
  th_text.innerHTML = 'Message';
  trow.appendChild(th_text);

  // Concludes creating the table headers

  const tbody = document.createElement('tbody');
  // Add tbody to table
  table.append(tbody);

  // Loop thru emails starts here. 
  emails.forEach((email) => {

    const trow = document.createElement('tr');
    trow.id = 'has_id';
    trow.dataset.id = email.id;
    // Want all read emails to have gray backgroud
    if (email.read === true) {
      trow.className = 'table-secondary';
    }
    tbody.appendChild(trow);

    const td_recipients = document.createElement('td');
    td_recipients.innerHTML = email.recipients;
    trow.appendChild(td_recipients);
  
    const td_subject = document.createElement('td');
    td_subject.innerHTML = email.subject;
    trow.appendChild(td_subject);
  
    const td_timestamp = document.createElement('td');
    td_timestamp.innerHTML = email.timestamp;
    trow.appendChild(td_timestamp);
  
    const td_body = document.createElement('td');
    // Add style to limit the visible text
    td_body.style.maxWidth = '300px'
    td_body.style.overflow = 'hidden'
    td_body.style.whiteSpace = 'nowrap'
    td_body.innerHTML = email.body;
    trow.appendChild(td_body);
  
  });
 
  // Setup event handler for rows
  const trows = document.querySelectorAll('#has_id');
  
  trows.forEach(row => {
    row.addEventListener('click', () => {
      
      const mailbox = document.querySelector('#email-views-title').textContent;
      load_email(row.dataset.id, mailbox);
      
    });

  });
  // Just want to remain with the list of emails 
  return false;
}


function load_email(id, mailbox){
  // This just loads one email and opens the view-myemail div
  // From this view the user should be able to archive/unarchive, read/unread the email or reply
  
  // Need to go ahead and mark this email as read
  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({
        read: true
    })
  });

  fetch(`/emails/${id}`)
  .then(response => response.json())
  .then(email => {
  
    // Show the mailbox name
    // Show the mailbox and hide other views
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    // New div added to view an email named view-myemail
    document.querySelector('#view-myemail').style.display = 'block';
    // Display header prefixed with which mailbox the user clicked on
    document.querySelector('#myemail-mailbox').innerHTML = `${mailbox} Mail`;
    // Fill out fields
    document.querySelector('#email-id').value = email.id
    document.querySelector('#myemail-from').innerHTML = email.sender;
    document.querySelector('#myemail-to').innerHTML = email.recipients;
    document.querySelector('#myemail-subject').innerHTML = email.subject;
    document.querySelector('#myemail-timestamp').innerHTML = email.timestamp;
    document.querySelector('#myemail-body').innerHTML = email.body;
    // Apply appropriate names to buttons
    if (email.archived == true) {
      document.querySelector('#archive-btn').innerHTML = 'Unarchive';
      document.querySelector('#archive-btn').dataset.btn = 'unarchive';
    } else {
      document.querySelector('#archive-btn').innerHTML = 'Archive';
      document.querySelector('#archive-btn').dataset.btn = 'archive';
    }

    if (email.read == true) {
      document.querySelector('#read-btn').innerHTML = 'Unread';
      document.querySelector('#read-btn').dataset.btn = 'unread'
    } else {
      document.querySelector('#read-btn').innerHTML = 'Read';
      document.querySelector('#read-btn').dataset.btn = 'read';
    }
  });
}


// Called from button on view_myemails
function update_estatus(item) {

  const id = document.querySelector('#email-id').value;
  const status = item.dataset.btn
  // Need to mark this email as unread or archive
  if (status === 'unread') {
      document.querySelector('#read-btn').innerHTML = 'Read';
      document.querySelector('#read-btn').dataset.btn = 'read';

      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: false       
        })
      });
  } else if (status === 'read') {

      document.querySelector('#read-btn').innerHTML = 'Unread';
      document.querySelector('#read-btn').dataset.btn = 'unread';
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            read: true        
        })
      });
  } else if (status === 'archive') {
    
      document.querySelector('#archive-btn').innerHTML = 'Unarchive';
      document.querySelector('#archive-btn').dataset.btn = 'unarchive';
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: true
        })
      });
  } else if (status === 'unarchive'){

      document.querySelector('#archive-btn').innerHTML = 'Archive';
      document.querySelector('#archive-btn').dataset.btn = 'archive';
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            archived: false
        })
      });
  } else if (status === 'reply') {

      fetch(`/emails/${id}`)
      .then(response => response.json())
      .then(email => {
        // Show/hide divs
        document.querySelector('#emails-view').style.display = 'none';
        document.querySelector('#view-myemail').style.display = 'none';
        document.querySelector('#compose-view').style.display = 'block';

        document.querySelector('#compose-recipients').value = email.sender;
        if (email.subject.substring(0,3) != 'Re:'){
          document.querySelector('#compose-subject').value = `Re: ${email.subject}`;
        } else {
          document.querySelector('#compose-subject').value = email.subject;
        }
        document.querySelector('#compose-view-title').innerHTML = 'Reply';
        const timestamp = email.timestamp;
        const body = email.body;
        let body_text = `On ${email.timestamp} ${email.sender} wrote: ${body.substring(0,10)}`;
        document.querySelector('#compose-body').innerHTML = body_text;
        // Reset title to New Mail

      })
  } 
}

// Works but not as planned.
// Need to work on this later not a priority
function show_mymessage(message) {
  
  const alert_div = document.querySelector('.alert');
  const msg_div = document.querySelector('.msg');
  msg_div.innerHTML = message;
  alert_div.classList.add("show");
  alert_div.classList.remove("hide");
  alert_div.classList.add("showAlert");
  setTimeout(function() {
    alert_div.classList.remove("show");
    alert_div.classList.add("hide");
  },2000);
}


// This function just hides divs not needed and loads page to enter a new email.
// Finished is working.
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  // New div added to view an email
  document.querySelector('#view-myemail').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  // Reset title to New Mail
  document.querySelector('#compose-view-title').innerHTML = 'New Mail';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}