document.getElementById('selectGuild').addEventListener('click', function () {
    // Capture the selected value from the dropdown
    var selectedValue = document.getElementById('guild').value;
    var dataToSend = {
        guild_index: selectedValue
    };
    // json send
    fetch('/select-guild/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataToSend)
    })
        .then(response => response.json())
        .then(data => {
            // Handle data
            var switchesDataDisplay = document.getElementById('serverInfo');
            if (data.switches) {
                // Guild exists
                switchesDataDisplay.innerText = 'Switches Data: ';
                var switchesData = data.switches;

                for (var switchName in switchesData) {
                    // Create a checkbox element
                    var checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.name = switchName;
                    checkbox.id = switchName;
                    checkbox.checked = switchesData[switchName];

                    var label = document.createElement('label');
                    label.htmlFor = switchName;
                    label.appendChild(document.createTextNode(switchName));

                    switchesDataDisplay.appendChild(label);
                    switchesDataDisplay.appendChild(checkbox);
                }
                var button = document.createElement('button');
                button.id = 'updateMongoDB'
                button.textContent = 'Update';
                button.addEventListener('click', function () {
                    // Checkbox data
                    var updateData = { guild_index: selectedValue };
                    // Iterate through each checkbox
                    checkboxes = document.querySelectorAll('input[type="checkbox"]');
                    checkboxes.forEach(function (checkbox) {
                        updateData[checkbox.id] = checkbox.checked;
                    });

                    // json send
                    fetch('/update-mongodb/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateData)
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log(data.message);
                            // Handle data

                        })



                });
                switchesDataDisplay.appendChild(document.createElement('br'));
                switchesDataDisplay.appendChild(button);
            }
            else {
                // Guild DNE
                switchesDataDisplay.innerText = 'North-Star bot is not in this server';
                var button = document.createElement('button');
                button.id = 'invite'
                button.textContent = 'Invite to server';
                button.addEventListener('click', function () {
                    // Specify the URL you want to redirect to
                    var redirectUrl = 'https://discord.com/api/oauth2/authorize?client_id=929856180984111167&permissions=8&scope=bot'; // Replace 'https://example.com/' with your desired URL

                    // Redirect to the specified URL
                    window.location.href = redirectUrl;
                });

                // Append the button to the document body or another container
                switchesDataDisplay.appendChild(document.createElement('br'));
                switchesDataDisplay.appendChild(button);

            }
        })
});