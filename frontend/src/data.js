export const cities = [
  { name: "Dhaka", slug: "dhaka", reported: 324, investigation: 98, trial: 156, convicted: 42, acquitted: 18 },
  { name: "Chattogram", slug: "chattogram", reported: 221, investigation: 71, trial: 103, convicted: 31, acquitted: 11 },
  { name: "Rajshahi", slug: "rajshahi", reported: 152, investigation: 43, trial: 68, convicted: 22, acquitted: 7 },
  { name: "Khulna", slug: "khulna", reported: 118, investigation: 38, trial: 51, convicted: 17, acquitted: 5 },
  { name: "Sylhet", slug: "sylhet", reported: 96, investigation: 29, trial: 44, convicted: 12, acquitted: 4 },
  { name: "Barishal", slug: "barishal", reported: 74, investigation: 21, trial: 32, convicted: 9, acquitted: 3 },
  { name: "Rangpur", slug: "rangpur", reported: 58, investigation: 17, trial: 26, convicted: 7, acquitted: 2 },
  { name: "Mymensingh", slug: "mymensingh", reported: 45, investigation: 13, trial: 19, convicted: 6, acquitted: 2 }
];

export const areas = [
  { name: "Uttara", city: "Dhaka", reported: 56, investigation: 18, trial: 22, convicted: 10, acquitted: 6, level: "High" },
  { name: "Mirpur", city: "Dhaka", reported: 48, investigation: 15, trial: 18, convicted: 8, acquitted: 4, level: "Moderate" },
  { name: "Dhanmondi", city: "Dhaka", reported: 42, investigation: 13, trial: 17, convicted: 7, acquitted: 3, level: "Moderate" },
  { name: "Gulshan", city: "Dhaka", reported: 38, investigation: 11, trial: 15, convicted: 6, acquitted: 2, level: "Low" },
  { name: "Motijheel", city: "Dhaka", reported: 31, investigation: 10, trial: 12, convicted: 5, acquitted: 2, level: "Moderate" },
  { name: "Wari", city: "Dhaka", reported: 28, investigation: 8, trial: 10, convicted: 4, acquitted: 1, level: "Low" }
];

export const cases = [
  { id: "BD-DHK-001", city: "Dhaka", area: "Uttara", status: "Convicted", court: "Judgment recorded", date: "2026-06-12", source: "Demo public record" },
  { id: "BD-DHK-002", city: "Dhaka", area: "Mirpur", status: "Under Trial", court: "Trial ongoing", date: "2026-05-21", source: "Demo public record" },
  { id: "BD-CTG-003", city: "Chattogram", area: "Kotwali", status: "Reported", court: "Investigation", date: "2026-05-03", source: "Demo public record" },
  { id: "BD-RJS-004", city: "Rajshahi", area: "Boalia", status: "Convicted", court: "Judgment recorded", date: "2026-04-18", source: "Demo public record" },
  { id: "BD-KHL-005", city: "Khulna", area: "Sonadanga", status: "Under Trial", court: "Trial ongoing", date: "2026-04-02", source: "Demo public record" },
  { id: "BD-SYL-006", city: "Sylhet", area: "Ambarkhana", status: "Reported", court: "Investigation", date: "2026-03-20", source: "Demo public record" }
];

export const monthly = [
  { month: "Jan", reported: 92, convicted: 15 },
  { month: "Feb", reported: 105, convicted: 18 },
  { month: "Mar", reported: 128, convicted: 21 },
  { month: "Apr", reported: 96, convicted: 16 },
  { month: "May", reported: 118, convicted: 24 },
  { month: "Jun", reported: 132, convicted: 25 },
  { month: "Jul", reported: 148, convicted: 29 },
  { month: "Aug", reported: 139, convicted: 28 },
  { month: "Sep", reported: 155, convicted: 32 },
  { month: "Oct", reported: 142, convicted: 31 },
  { month: "Nov", reported: 167, convicted: 35 },
  { month: "Dec", reported: 151, convicted: 33 }
];

export const emergency = [
  { title: "Emergency", number: "999", detail: "Immediate police, fire or ambulance support" },
  { title: "Women & Child Helpline", number: "109", detail: "Support and referral service" },
  { title: "National Helpline", number: "16123", detail: "Information and support" }
];
