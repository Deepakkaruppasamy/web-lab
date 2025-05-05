function val() {
    const name = document.getElementById('name').value;
    const reg = document.getElementById('reg').value;
    const pro = document.getElementById('pro').value;
    const branch = document.getElementById('branch').value;
    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;

    if (!name || !reg || !pro || !branch || !from || !to) {
        alert('Please fill out all fields in the Student Record section.');
        return false;
    }

    alert('Student Record submitted successfully!');
    return true;
}

function bio() {
    const bname = document.getElementById('bname').value;
    const dob = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const cc = document.getElementById('cc').value;
    const father = document.getElementById('father').value;
    const address = document.getElementById('address').value;
    const occupation = document.getElementById('occupation').value;
    const income = document.getElementById('income').value;
    const place = document.getElementById('place').value;

    if (!bname || !dob || !email || !cc || !father || !address || !occupation || !income || !place) {
        alert('Please fill out all fields in the Biodata section.');
        return false;
    }

    alert('Biodata submitted successfully!');
    return true;
}