Strophe.addConnectionPlugin('dkarma', {
    _connection: null,
    init: function (conn) {
        this._connection = conn;
    },
    /*Function
    Queries a room info
    (String) room - The multi-user chat room name.
    (Function) success_cb - Optional function to handle the info.
    (Function) error_cb - Optional function to handle an error.
    Returns:
    id - the unique id used to send the info request
    */
    queryRoomInfo: function (room, success_cb, error_cb) {
        var attrs, info;
        attrs = {
            xmlns: Strophe.NS.DISCO_INFO
        };
        info = $iq({
            from: this._connection.jid,
            to: room,
            type: 'get'
        }).c('query', attrs);
        return this._connection.sendIQ(info, success_cb, error_cb);
    },
    /*Function
    Queries a room member list
    (String) room - The multi-user chat room name.
    (Function) success_cb - Optional function to handle the info.
    (Function) error_cb - Optional function to handle an error.
    Returns:
    id - the unique id used to send the info request
    */
    queryMemberListInfo: function (room, success_cb, error_cb) {
        var attrs,item, info;
        attrs = {
            xmlns: Strophe.NS.MUC_ADMIN
        };
        item = $build("item", {
            affiliation: "member"
        });
        info = $iq({
            from: this._connection.jid,
            to: room,
            type: 'get'
        }).c('query', attrs).cnode(item.node);
        return this._connection.sendIQ(info, success_cb, error_cb);
    }
});
