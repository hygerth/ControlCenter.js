(function($) {
	var IO = {
		init: function() {
			IO.socket = io.connect();
			IO.connectEvents();
			IO.connectElements();
		},

		connectEvents: function() {
			IO.socket.on('list', function(data) {
				IO.listAllDevices(data);
			});
		},

		connectElements: function() {
			$(document).on('click', '.switch', IO.sendToogle);
		},

		listAllDevices: function(data) {
			$('#list').html('');
			var devices = data.devices;
			for (var i = 0; i < devices.length; i++) {
				var device = devices[i];
				var name = document.createElement('li');
				name.id = 'name';
				name.innerHTML = IO.capitalize(device.name);

				var status = document.createElement('li')
				status.innerHTML = '<button id="' + device.status.toLowerCase() + '" class="switch" value="' + device.id + '">' + device.status + '</button>';

				var row = document.createElement('ul');
				row.id = 'row';
				row.appendChild(name);
				row.appendChild(status);

				var rowContainer = document.createElement('li');
				rowContainer.appendChild(row);

				$('#list').append(rowContainer);
			}
		},

		sendToogle: function() {
			var id = $(this).val();
			var status = $(this).attr('id');
			var data = {
				id: id,
				status: status
			}
			IO.socket.emit('toogle', data);
		},

		capitalize: function(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}
	}
	IO.init();
}($));
