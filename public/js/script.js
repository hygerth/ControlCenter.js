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
            $(document).on('click', 'input', IO.sendToogle);
        },

        listAllDevices: function(data) {
            var devices = data.devices || [];
            var items = $('.list').children();
            for (var i = 0; i < devices.length; i++) {
                var device = devices[i];
                if (i >= items.length) {
                    var li = document.createElement('li');
                    li.className = 'item group';
                    li.innerHTML = '<p></p><label class="toggle"><input type="checkbox"><div class="track"><div class="handle"></div></div></label>';
                    $('.list').append(li);
                    items = $('.list').children();
                }
                var item = items[i];
                $(item).find('p').text(IO.capitalize(device.name));
                $(item).find('label').attr('id', device.id);
                var status = IO.convertStatus(device.status);
                $(item).find('input').prop('checked', status[0]);
            }
        },

        sendToogle: function() {
            var id = $(this).parent().attr('id');
            var status = IO.convertStatus(this.checked);
            var data = {
                id: id,
                status: status[1]
            };
            IO.socket.emit('toogle', data);
        },

        convertStatus: function(status) {
            if (status === true || status.toString().toLowerCase() === 'on') {
                return [true, 'on'];
            } else {
                return [false, 'off'];
            }
        },

        capitalize: function(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }
    };
    IO.init();
}($));
