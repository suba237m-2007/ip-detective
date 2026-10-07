
function analyzeIP() {

    let ip = document.getElementById("ipAddress").value.trim();
    let mask = document.getElementById("subnetMask").value.trim();

    let error = document.getElementById("error");

    error.innerText = "";

    // Check IP
    let ipParts = ip.split(".");

    if (
        ipParts.length !== 4 ||
        ipParts.some(part => part === "" || isNaN(part) || Number(part) < 0 || Number(part) > 255)
    ) {
        error.innerText = "❌ Please enter a valid IPv4 address.";
        return;
    }

    // Check subnet mask
    let maskParts = mask.split(".");

    if (
        maskParts.length !== 4 ||
        maskParts.some(part => part === "" || isNaN(part) || Number(part) < 0 || Number(part) > 255)
    ) {
        error.innerText = "❌ Please enter a valid subnet mask.";
        return;
    }

    // Convert IP and mask to numbers
    let ipNumbers = ipParts.map(Number);
    let maskNumbers = maskParts.map(Number);

    // Calculate CIDR
    let binaryMask = "";

    maskNumbers.forEach(num => {
        binaryMask += num.toString(2).padStart(8, "0");
    });

    // Validate subnet mask
    if (!/^1*0*$/.test(binaryMask)) {
        error.innerText = "❌ Invalid subnet mask.";
        return;
    }

    let cidrValue = binaryMask.split("1").length - 1;

    // IP Class
    let firstOctet = ipNumbers[0];

    let ipClass;

    if (firstOctet >= 1 && firstOctet <= 126) {
        ipClass = "Class A";
    }
    else if (firstOctet >= 128 && firstOctet <= 191) {
        ipClass = "Class B";
    }
    else if (firstOctet >= 192 && firstOctet <= 223) {
        ipClass = "Class C";
    }
    else if (firstOctet >= 224 && firstOctet <= 239) {
        ipClass = "Class D";
    }
    else {
        ipClass = "Class E";
    }

    // Network address
    let network = [];

    for (let i = 0; i < 4; i++) {
        network[i] = ipNumbers[i] & maskNumbers[i];
    }

    // Broadcast address
    let broadcast = [];

    for (let i = 0; i < 4; i++) {
        broadcast[i] = network[i] | (255 - maskNumbers[i]);
    }

    // Total addresses
    let totalAddresses = Math.pow(2, 32 - cidrValue);

    // Usable hosts
    let usableHosts;

    if (cidrValue === 32) {
        usableHosts = 1;
    }
    else if (cidrValue === 31) {
        usableHosts = 2;
    }
    else {
        usableHosts = totalAddresses - 2;
    }

    // First host
    let firstHost = [...network];

    if (cidrValue <= 30) {
        firstHost[3]++;
    }

    // Last host
    let lastHost = [...broadcast];

    if (cidrValue <= 30) {
        lastHost[3]--;
    }

    // Display results
    document.getElementById("resultIP").innerText = ip;

    document.getElementById("ipClass").innerText = ipClass;

    document.getElementById("resultMask").innerText = mask;

    document.getElementById("cidr").innerText = "/" + cidrValue;

    document.getElementById("networkAddress").innerText =
        network.join(".");

    document.getElementById("broadcastAddress").innerText =
        broadcast.join(".");

    document.getElementById("firstHost").innerText =
        firstHost.join(".");

    document.getElementById("lastHost").innerText =
        lastHost.join(".");

    document.getElementById("totalAddresses").innerText =
        totalAddresses.toLocaleString();

    document.getElementById("usableHosts").innerText =
        usableHosts.toLocaleString();
}


function clearResult() {

    document.getElementById("ipAddress").value = "";

    document.getElementById("subnetMask").value = "";

    document.getElementById("error").innerText = "";

    document.getElementById("resultIP").innerText = "-";

    document.getElementById("ipClass").innerText = "-";

    document.getElementById("resultMask").innerText = "-";

    document.getElementById("cidr").innerText = "-";

    document.getElementById("networkAddress").innerText = "-";

    document.getElementById("broadcastAddress").innerText = "-";

    document.getElementById("firstHost").innerText = "-";

    document.getElementById("lastHost").innerText = "-";

    document.getElementById("totalAddresses").innerText = "-";

    document.getElementById("usableHosts").innerText = "-";
}
