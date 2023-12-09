const url = window.location.search;
const urlparams = new URLSearchParams(url);
const search = urlparams.get("expertname");
const search1 = urlparams.get("mode");

const sessionsitems = JSON.parse(localStorage.getItem("sessioninfo"));

const user_details = JSON.parse(localStorage.getItem("user_details"));

const details = localStorage.getItem("details");
const active_user = user_details.find((value) => value.user_email === details);

let appoitement_list;
if (localStorage.getItem("appoitement_list_srt")) {
  appoitement_list = JSON.parse(localStorage.getItem("appoitement_list_srt"));
} else {
  appoitement_list = [];
}

let result;

sessionsitems.forEach((e) => {
  if (e.id == search) {
    return (result = e);
  }
});

let act_user_id = 0;
for (let i = 0; i < user_details.length; i++) {
  if (user_details[i].user_email == details) {
    act_user_id = user_details[i].user_id;
    // console.log(user_details[i].per_exp_id);
  }
}

console.log(result);
// timing filter

const timingOptions = {
  timing0: "12:00 AM-1:00 AM",
  timing1: "1:00 AM-2:00 AM",
  timing2: "2:00 AM-03:00 AM",
  timing3: "3:00 AM-4:00 AM",
  timing4: "4:00 AM-5:00 AM",
  timing5: "5:00 AM-6:00 AM",
  timing6: "6:00 AM-7:00 AM",
  timing7: "7:00 AM-8:00 AM",
  timing8: "8:00 AM-9:00 AM",
  timing9: "9:00 AM-10:00 AM",
  timing10: "10:00 AM-11:00 AM",
  timing11: "11:00 AM-12:00 PM",
  timing12: "12:00 PM-1:00 PM",
  timing13: "1:00 PM-2:00 PM",
  timing14: "2:00 PM-3:00 PM",
  timing15: "3:00 PM-4:00 PM",
  timing16: "4:00 PM-5:00 PM",
  timing17: "5:00 PM-6:00 PM",
  timing18: "6:00 PM-7:00 PM",
  timing19: "7:00 PM-8:00 PM",
  timing20: "8:00 PM-9:00 PM",
  timing21: "9:00 PM-10:00 PM",
  timing22: "10:00 PM-11:00 PM",
  timing23: "11:00 PM-12:00 AM",
};
const { startTime } = result;
console.log(startTime);
const { endTime } = result;
// console.log(endTime);

const starttimetrim = startTime.trim().toUpperCase();

const endTimetrim = endTime.trim().toUpperCase();
// console.log(endTimetrim);

let startTimeKey, endTimeKey;

for (const timekey in timingOptions) {
  // console.log(timingOptions[timekey].startsWith(starttimetrim));

  if (timingOptions[timekey].startsWith(starttimetrim)) {
    startTimeKey = timekey;
  }
  if (timingOptions[timekey].endsWith(endTimetrim)) {
    endTimeKey = timekey;
  }
}
// console.log(startTimeKey);

const startIndexNo = Number(startTimeKey.substring(6));

let endindexNo = Number(endTimeKey.substring(6));

if (startIndexNo > endindexNo) {
  endindexNo += 24;
}


const ExperttimeOptions = {};
for (let i = startIndexNo; i <= endindexNo; i++) {
  const indexno = i % 24;
  const timeKey = `timing${indexno}`;
  ExperttimeOptions[timeKey] = timingOptions[timeKey];
}

// for date
const date = document.getElementById("appoitment_date");

// let today = new Date().toISOString().split("T")[0];
const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
  .toISOString()
  .split("T")[0];
date.setAttribute("min", today);

function getDateOneWeekAfter(date) {
  const oneWeekLater = new Date(date);
  oneWeekLater.setDate(oneWeekLater.getDate() + 7);
  max_date = oneWeekLater.toISOString().split("T")[0];
  return max_date;
}

const currentDate = new Date(); // Get the current date
const oneWeekLater = getDateOneWeekAfter(currentDate);
console.log(oneWeekLater);
date.setAttribute("max", oneWeekLater);
// date.addEventListener("")

const select_timings = document.getElementById("time_slot");
select_timings.setAttribute("class", "timings");
select_timings.setAttribute("required", "");

const hour = new Date().getHours();
const minut = new Date().getMinutes();
function convertTo12HourFormat(hours) {
  // let suffix = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12; // Convert 0 to 12
  return `${hours}`;
}
// :${minutes} ${suffix} minutes
const time12 = convertTo12HourFormat(hour);
console.log(time12); // Output: "2:30 PM"

const date_input = document.querySelector("#appoitment_date");
date_input.addEventListener("input", (e) => {
  console.log(date_input.value);
  if (date_input.value == today) {
    alert("Book appoitement one day before");
  } else {
    for (const time in ExperttimeOptions) {
      const option_timings = document.createElement("option");
      option_timings.innerText = ExperttimeOptions[time];
      for (let i = 0; i < appoitement_list.length; i++) {
        if (appoitement_list[i].appoitment_date == date_input.value) {
          if (appoitement_list[i].time_slot == option_timings.innerText) {
            option_timings.setAttribute("disabled", "");
          }
        }
      }
      select_timings.append(option_timings);
    }
  }
});

const expert_name = document.getElementById("expert_name");
expert_name.innerText = result.person_name;

const session_mode = document.getElementById("session_mode");
session_mode.innerText = search1;

const user_email = document.getElementById("user_email");
user_email.value = active_user.user_email;

const number = document.getElementById("number");
number.value = active_user.mobile_number;

const appoitment_book = document.getElementById("appoitment_book");
appoitment_book.addEventListener("submit", (s) => {
  s.preventDefault();

  appoitment_book_fun();
});

function appoitment_book_fun() {
  console.log("entered");

  const expert_id = search;
  const user_id = act_user_id;
  const appoitement_id = appoitement_list.length + 1;
  const appoitment_date = document.getElementById("appoitment_date").value;
  const time_slot = document.getElementById("time_slot").value;
  const number = document.getElementById("number").value;
  const user_email = document.getElementById("user_email").value;
  const catagory = document.getElementById("catagory").value;

  let aakash = 0;

  for (let i = 0; i < appoitement_list.length; i++) {
    const check = appoitement_list[i];
    if (check.expert_id == expert_id) {
      if (check.appoitment_date == appoitment_date) {
        if (check.time_slot == time_slot) {
          aakash = 1;
        }
      }
    }
  }

  if (aakash == 1) {
    alert("slot already booked, try booking another slot");
  }
  if (aakash == 0) {
    const appoitement = {
      expert_id,
      user_id,
      appoitement_id,
      appoitment_date,
      time_slot,
      number,
      user_email,
      catagory,
      type: search1,
    };

    appoitement_list.push(appoitement);

    localStorage.setItem(
      "appoitement_list_srt",
      JSON.stringify(appoitement_list)
    );

    for (let i = 0; i < user_details.length; i++) {
      if (user_details[i].user_email == details) {
        user_details[i].per_exp_id = expert_id;
      }
    }

    localStorage.setItem("user_details", JSON.stringify(user_details));

    Email.send({
      Host: "smtp.elasticemail.com",
      Username: "betterme.support@gmail.com",
      Password: "8944977E22A15FA242119610AD84908E0927",
      To: details,
      From: "aakashbala205@gmail.com",
      Subject: "Appoitment confirmation ",
      Body: "Hi",
    }).then((success) => {
      alert(
        "your session has been confirmed with our expert and refer the email in your Inbox"
      );
    });

    window.location.href = "./../visit_conformation.html";
  }
}
