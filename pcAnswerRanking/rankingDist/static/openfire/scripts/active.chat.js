//公共回调方法容器
var chatCommonEventHander = {
    //加入房间Message回调
    onRoomMessage: function (stanza, room) {
        if (chat_room.iscreating) {
            chat_room.CAEH.onCreateRoomMessage(stanza, room);
        }
        return true;
    },
    //加入房间Presence回调
    onRoomPresence: function (stanza, room) {
        chat_room.roomconnected = true;
        if (chat_room.iscreating) {
            console.log("当前为:Presence回调,正在创建房间,即将转向onCreateRoomPresence");
            chat_room.CAEH.onCreateRoomPresence(stanza, room);
        }
        else {
            console.log("已加入房间");
            var eventHandler = chat_room.processEventHandle.pop();
            if (eventHandler) {
                eventHandler();
            }
        }
        return true;
    },
    //加入房间Roster回调
    onRoomRoster: function (stanza, room) {
        if (chat_room.iscreating) {
            console.log("当前为:Roster回调,正在创建房间,即将转向onCreateRoomPresence");
            chat_room.CAEH.onCreateRoomPresence(stanza, room);
        }
        return true;
    },
    //获取成员列表成功
    onFetchRoomMemberListSuccess: function (stanza, room) {
        console.log(occupants);
        return true;
    },
    //获取成员列表失败
    onFetchRoomMemberListFail: function (stanza, room) {
        console.log(occupants);
        return true;
    },
    //查询单个房间信息成功(join)
    onQueyRoomInfoForJoinSuccess: function (stanza, room) {
        console.log("房间存在,即将加入房间");
        chat_room.joinRoom();
        return true;
    },
    //查询单个房间信息失败(join)
    onQueyRoomInfoForJoinFail: function (stanza, room) {
        console.log("房间不存在,中断操作");
        return true;
    }
}


//系统管理员事件回调方法容器
var chatAdminEventHander = {

    /*------【第一步】查询房间是否存在------*/
    //查询单个房间信息成功(创)
    onQueyRoomInfoForCreateSuccess: function (stanza, room) {
        console.log("第一步-房间已经存在、中断创建操作");
        console.log(stanza);
        return true;
    },
    //查询单个房间信息失败(创)
    onQueyRoomInfoForCreateFail: function (stanza, room) {
        console.log("第一步-未查询到房间信息、即将进行创建");
        chat_room.createRoom();//@===================================->>开始进入创建房间环节=>>【第二步】
        return true;
    },

    /*------【第二步】创建房间------*/
    //创建房间Message回调
    onCreateRoomMessage: function (stanza, room) {
        console.log("第二步-创建房间Message回调");
        console.log(stanza);
        return true;
    },
    //创建房间Presence回调
    onCreateRoomPresence: function (stanza, room) {
        console.log("第二步-创建房间Presence回调");
        chat_room.fetchRoomConfigInfo();//@===================->>开始进入获取房间配置信息环节=>>【第三步】
        return true;
    },
    //创建房间Roster回调
    onCreateRoomRoster: function (occupants, room) {
        console.log("第二步-创建房间Roster回调");
        console.log(occupants);
        return true;
    },

    /*------【第三步】获取房间配置信息------*/
    //获取房间配置信息成功
    onConfigureRoomSuccess: function (stanza, room) {
        console.log("第三步-获取房间配置信息成功");
        chat_room.submitRoomConfigInfo();//@==================->>开始进入提交房间配置信息环节=>>【第四步】
        return true;
    },
    //获取房间配置信息失败
    onConfigureRoomFail: function (stanza, room) {
        console.log("第三步-获取房间配置信息失败");
        console.log(stanza);
        return true;
    },

    /*------【第四步】提交房间配置信息------*/
    //提交房间配置信息成功
    onSubmitConfigureSuccess: function (stanza, room) {
        console.log("第四步-提交房间配置信息成功");
        if (chat_room.needAuthorize) {//检测代加入成员队列是否为空
            chat_room.addMember();//@=========================->>开始进入授予成员执行队列循环=>>【第五步】
        }
        return true;
    },
    //提交房间配置信息失败
    onSubmitConfigureFail: function (stanza, room) {
        console.log("第四步-提交房间配置信息失败");
        console.log(stanza);
        return true;
    },

    /*------【第五步】授予成员资格------*/
    //授予成员资格成功
    onModifyAffiliationSuccess: function (stanza, room) {
        console.log("第五步-授予成员资格");
        console.log("needAuthorize:" + chat_room.needAuthorize);
        if (chat_room.needAuthorize) {//检测代加入成员队列是否为空
            chat_room.addMember();//@=================->>继续循环授予成员执行队列直至队列清空<<=>>【第五步】
        }
        return true;
    },
    //授予成员资格失败
    onModifyAffiliationFail: function (stanza, room) {
        console.log("第五步-授予成员资格失败");
        return true;
    },
    /*----------------【独立操作】---------------*/
    //取消成员资格成功
    onRevokeMemberAuthorizationSuccess: function (stanza, room) {
        console.log("operation-取消成员资格成功");
        console.log(stanza);
        if (chat_room.needRevokeAuthorize) {//检测代取消授权成员队列是否为空
            chat_room.revokeMember();//@=================->>继续循环取消授予成员执行队列直至队列清空
        }
    },
    //取消成员资格失败
    onRevokeMemberAuthorizationFail: function (stanza, room) {
        console.log("operation-取消成员资格失败");
        console.log(stanza);
    }
}


//聊天室对象
var chat_room = {
    connection: null,//strophe连接对象
    connected: false,//连接状态
    roomconnected: false,//聊天室连接状态
    ROOM_JID: null,//聊天室Jid
    JID: null,//当前登录者Jid
    nickname: null,//昵称
    username: null,//登录名
    _login_callback: null,//登录回调
    _loginOut_callback: null,//注销登录回调
    create_room_callback: null,//创建房间完毕时回调
    recv_message_callback: null,//接收消息回调(内部方法)
    client_msg_callback: null,//接收消息回调(外部方法)
    addmember_callback: null,//添加成员授权回调
    iscreating: false,//是否正在创建房间
    authorizeQueue: [],//授权队列
    needAuthorize: false,//授权队列是否有对象等待
    revokeAuthorizeQueue: [],//取消授权队列
    needRevokeAuthorize: false,//取消授权队列是否有对象等待
    chat_current_message_id: "",//当前发送的消息id,以便与服务器回发回来的消息进行核对,来分辨是否为原始发送方
    processEventHandle: [],//加入房间后需要执行的处理例程集合
    CCEH: chatCommonEventHander,//chatCommonEventHander的缩写,公共回调事件处理程序
    CAEH: chatAdminEventHander,//chatAdminEventHander的缩写,系统管理员回调事件处理程序
    rawInput: function (data) {
        if (chat_debug) {
            console.log("RECV");
            console.log(data);
        }
        return true;
    },
    rawOutput: function (data, s) {
        if (chat_debug) {
            console.log("SENT");
            console.log(data);
        }
        return true;
    },
    onConnect: function (status) {
        switch (status) {
            case Strophe.Status.CONNECTING:
                chat_room.connected = false;
                console.log('Strophe is connecting.');
                break;
            case Strophe.Status.CONNFAIL:
                chat_room.connected = false;
                console.log('Strophe failed to connect.');
                break;
            case Strophe.Status.DISCONNECTING:
                chat_room.connected = false;
                console.log('Strophe is disconnecting.');
                break;
            case Strophe.Status.DISCONNECTED:
                chat_room.connected = false;
                console.log('Strophe is disconnected.');
                if (chat_room._loginOut_callback) {
                    var _callback = chat_room._loginOut_callback;
                    chat_room._loginOut_callback = null;
                    _callback(chat_room.JID);
                }
                break;
            case Strophe.Status.CONNECTED:
                chat_room.connected = true;
                chat_room.online();
                console.log('Strophe is connected.');
                if (chat_room._login_callback) {
                    var _callback = chat_room._login_callback;
                    chat_room._login_callback = null;
                    _callback(chat_room.JID);
                }

                break;
        }
    },
    msgXmlParser: function (stanza) {
        if (stanza.nodeName == "message") {
            var type, from, to, content, html, roomname, sender, time, id;
            type = stanza.getAttribute('type');
            from = stanza.getAttribute('from');
            if (!from) {
                return true;
            }
            to = stanza.getAttribute('to');
            if (!to) {
                return true;
            }
            time = stanza.getAttribute('time');
            if (!time) {
                return true;
            }
            id = stanza.getAttribute('id');
            if (!id) {
                return true;
            }
            //过滤掉openfire的发送的历史记录
            var delay = $(stanza).find("delay").length;
            if (delay > 0) {
                return true;
            }

            html = $(stanza).find("html").length > 0 ? $(stanza).find("html").eq(0).html() : "";
            content = $(stanza).find("body").eq(0).text();
            if (type == "groupchat") {
                roomname = from.split("/")[0];
                sender = from.split("/")[1];

                var msgObj = { type: type, from: from, to: to, content: content, html: html, roomname: roomname, sender: sender, time: time, id: id };
                if (chat_room.recv_message_callback) {
                    chat_room.recv_message_callback(msgObj);
                }
            }
        }
        return true;
    },
    //初始化链接对象
    init: function () {
        chat_room.connection = new Strophe.Connection(BOSH_SERVICE);
        chat_room.connection.rawInput = chat_room.rawInput;
        chat_room.connection.rawOutput = chat_room.rawOutput;
        chat_room.connection.xmlInput = function (data) {
            chat_room.msgXmlParser(data);
        };
    },
    //初始化聊天室参数(外部调用)
    initGroup: function (username, groupname, _callback) {
        chat_room.username = username;
        chat_room.JID = username + "@" + chat_domain;
        chat_room.ROOM_JID = groupname + '@' + chat_subdomain + "." + chat_domain;
        if (_callback) {
            chat_room.recv_message_callback = _callback;
        }
    },
    //创建房间(仅限系统管理员)
    createRoom: function () {
        chat_room.callJoinOrCreateRoom();
    },
    //加入房间
    joinRoom: function () {
        chat_room.callJoinOrCreateRoom();
    },
    //创建或加入房间
    callJoinOrCreateRoom: function () {
        chat_room.connection.muc.join(chat_room.ROOM_JID, chat_room.nickname, chat_room.CCEH.onRoomMessage, chat_room.CCEH.onRoomPresence, chat_room.CCEH.onRoomRoster);
    },
    //获取房间配置信息(仅限系统管理员)
    fetchRoomConfigInfo: function () {
        chat_room.connection.muc.configure(chat_room.ROOM_JID, chat_room.CAEH.onConfigureRoomSuccess, chat_room.CAEH.onConfigureRoomFail);
    },
    //提交房间配置信息(仅限系统管理员)
    submitRoomConfigInfo: function () {
        chat_room.connection.muc.createConfiguredRoom(chat_room.ROOM_JID, roomConfigureInfo, chat_room.CAEH.onSubmitConfigureSuccess, chat_room.CAEH.onSubmitConfigureFail);
    },
    //授予成员资格(仅限系统管理员)
    addMember: function () {
        var membername = chat_room.authorizeQueue.pop();
        if (membername) {
            var jid = membername + "@" + chat_domain;
            chat_room.connection.muc.member(chat_room.ROOM_JID, jid, "active member", chat_room.CAEH.onModifyAffiliationSuccess, chat_room.CAEH.onModifyAffiliationFail);
        }
        else {
            chat_room.needAuthorize = false;
            if (chat_room.create_room_callback) {

                var callback = chat_room.create_room_callback;
                chat_room.create_room_callback = null;
                callback();
            }
            if (chat_room.addmember_callback) {
                var callback = chat_room.addmember_callback;
                chat_room.addmember_callback = null;
                callback();
            }
        }
    },
    //取消成员资格(仅限系统管理员)
    revokeMember: function () {
        var membername = chat_room.revokeAuthorizeQueue.pop();
        if (membername) {
            var jid = membername + "@" + chat_domain;
            console.log(jid);
            chat_room.connection.muc.revoke(chat_room.ROOM_JID, jid, "not member", chat_room.CAEH.onRevokeMemberAuthorizationSuccess, chat_room.CAEH.onRevokeMemberAuthorizationFail);
        }
        else {
            chat_room.needRevokeAuthorize = false;
        }
    },
    //查询所有房间
    queyAllroom: function () {
        chat_room.connection.muc.listRooms(chat_subdomain + "." + chat_domain);
    },
    //发送消息
    sendMessage: function (jid, message_text) {
        if (chat_room.connected) {
            var msg = $msg({
                to: jid,
                from: chat_room.JID,
                type: 'chat'
            }).c("body", null, message_text);
            connection.send(msg.tree());
        } else {
            console.log("请先登录！");
        }
    },
    //发送群组消息
    sendGroupMessage: function (message_text, html_message, time, msgid) {
        if (chat_room.connected) {
            chat_room.connection.muc.messageExtend(chat_room.ROOM_JID + "/" + chat_room.nickname, null, message_text, html_message ? html_message : null, time, null, msgid);
        }
        else {
            console.log("请先登录！");
        }
    },
    //把事件添加进join room后的执行队列
    addEventHandlerToProcess: function (eventHander) {
        chat_room.processEventHandle.push(eventHander);
    },
    //把待加入成员加入授权队列(外部调用)
    addMemberListToQueue: function (memberlist) {
        var members = memberlist.split(",");
        for (var i = 0; i < members.length; i++) {
            chat_room.authorizeQueue.push(members[i]);
        }
        if (members.length > 0) {
            chat_room.needAuthorize = true;
        }
    },
    //把待取消成员加入取消授权队列(外部调用)
    addMemberListToRevokeQueue: function (memberlist) {
        var members = memberlist.split(",");
        for (var i = 0; i < members.length; i++) {
            chat_room.revokeAuthorizeQueue.push(members[i]);
        }
        if (members.length > 0) {
            chat_room.needRevokeAuthorize = true;
        }
    },
    //登入(外部调用)
    login: function (_callback) {
        chat_room.init();
        chat_room.nickname = chat_room.username;
        chat_room._login_callback = _callback ? _callback : null;
        chat_room.connection.connect(chat_room.JID, chat_user_password, chat_room.onConnect);
    },
    //登出(外部调用)
    loginOut: function (_callback) {
        chat_room._loginOut_callback = _callback ? _callback : null;
        chat_room.connection.disconnect();
    },
    //上线(外部调用)
    online: function () {
        var elementShow = Strophe.xmlElement('show', {}, 'chat');
        var elementStatus = Strophe.xmlElement('status', {}, 'i am on line');
        var presence = $pres({ from: this.JID, xmlns: 'jabber:client', 'xmlns:stream': 'http://etherx.jabber.org/streams', version: '1.0' })
            .cnode(elementShow).up()
            .cnode(elementStatus);
        chat_room.connection.send(presence.tree());
    },
    //离线(外部调用)
    offline: function () {
        chat_room.connection.send($pres({ from: this.JID, type: 'unavailable' }).tree());
    }
}

var chatting = {
    initGroup: function (username, groupname, _callback) {
        chat_room.initGroup(username, groupname, _callback);
    },
    login: function (_callback) {
        chat_room.login(_callback);
    },
    loginOut: function (_callback) {
        chat_room.loginOut(_callback);
    },
    online: function () {
        chat_room.online();
    },
    offline: function () {
        chat_room.offline();
    },
    setCreateStatus: function () {
        chat_room.iscreating = true;
    },
    cancelCreateStatus: function () {
        chat_room.iscreating = false;
    },
    //查询房间是否存在,用于检测待创建房间前是否存在(仅限系统管理员)(外部调用)
    //参数:memberCollection,以逗号分割的成员id
    queyRoomInfoForCreate: function (memberCollection, createCallback) {
        if (chat_room.username != chat_SystemAdministrator) {
            console.log(chat_room.username + ":只有系统管理员有权限进行此操作");
            return false;
        }
        else {
            if (memberCollection) {
                chat_room.addMemberListToQueue(memberCollection);
            }
            if (createCallback) {
                chat_room.create_room_callback = createCallback;
            }
            if (!chat_room.connected) {
                chat_room.login(function (e) {
                    console.log("系统管理员已登录");
                    chat_room.connection.dkarma.queryRoomInfo(chat_room.ROOM_JID, chat_room.CAEH.onQueyRoomInfoForCreateSuccess, chat_room.CAEH.onQueyRoomInfoForCreateFail);
                });
            }
            else {
                chat_room.connection.dkarma.queryRoomInfo(chat_room.ROOM_JID, chat_room.CAEH.onQueyRoomInfoForCreateSuccess, chat_room.CAEH.onQueyRoomInfoForCreateFail);
            }
        }


    },
    //检测房间是否存在
    queryRoomForChoice: function (success, fail) {
        console.log(chat_room.connection.muc);
        chat_room.connection.dkarma.queryRoomInfo(chat_room.ROOM_JID, success, fail);
    },
    //授予成员资格(仅限系统管理员)(外部调用)
    //参数:memberCollection,以逗号分割的成员id
    addRoomMember: function (memberCollection, _callback) {
        if (chat_room.username != chat_SystemAdministrator) {
            console.log(chat_room.username + ":只有系统管理员有权限进行此操作");
            return false;
        }
        else {
            chat_room.addmember_callback = _callback ? _callback : null;
            chat_room.addMemberListToQueue(memberCollection);
            if (!chat_room.connected) {
                chat_room.login(function (e) {
                    console.log("系统管理员已登录");
                    chatting.queyRoomInfoForJoin([function () {
                        console.log("系统管理员已加入聊天室,开始授权成员权限给当前用户");
                        chat_room.addMember();
                    }]);
                });
            }
            else if (!chat_room.roomconnected) {
                chatting.queyRoomInfoForJoin([function () {
                    console.log("系统管理员已加入聊天室,开始授权成员权限给当前用户");
                    chat_room.addMember();
                }]);
            }
            else {
                chat_room.addMember();
            }
        }

    },
    //取消成员资格(仅限系统管理员)(外部调用)
    //参数:memberCollection,以逗号分割的成员id
    revokeRoomMember: function (memberCollection) {
        if (chat_room.username != chat_SystemAdministrator) {
            console.log(chat_room.username + ":只有系统管理员有权限进行此操作");
            return false;
        }
        else {
            chat_room.addMemberListToRevokeQueue(memberCollection);
            if (!chat_room.connected) {
                chat_room.login(function (e) {
                    chatting.queyRoomInfoForJoin([function () {
                        chat_room.revokeMember();
                    }]);
                });
            }
            else if (!chat_room.roomconnected) {
                chatting.queyRoomInfoForJoin([function () {
                    chat_room.revokeMember();
                }]);
            }
            else {
                chat_room.revokeMember();
            }
        }
    },
    //查询房间是否存在,用于检测待加入房间前是否存在(任何人)(外部调用)
    //参数:EventQueue,[function(){},function(){}]方法数组
    queyRoomInfoForJoin: function (EventQueue) {
        if (EventQueue) {
            for (var i = 0; i < EventQueue.length; i++) {
                var eventHander = EventQueue[i];
                chat_room.addEventHandlerToProcess(eventHander);
            }
        }
        chat_room.connection.dkarma.queryRoomInfo(chat_room.ROOM_JID, chat_room.CCEH.onQueyRoomInfoForJoinSuccess, chat_room.CCEH.onQueyRoomInfoForJoinFail);
    },
    //查询房间成员列表(外部调用)
    queyRoomMemberList: function () {
        if (!chat_room.connected) {
            chat_room.login(function (e) {
                chatting.queyRoomInfoForJoin([function () {
                    chat_room.connection.dkarma.queryMemberListInfo(chat_room.ROOM_JID, chat_room.CCEH.onFetchRoomMemberListSuccess, chat_room.CCEH.onFetchRoomMemberListFail);
                }]);
            });
        }
        else if (!chat_room.roomconnected) {
            chatting.queyRoomInfoForJoin([function () {
                chat_room.connection.dkarma.queryMemberListInfo(chat_room.ROOM_JID, chat_room.CCEH.onFetchRoomMemberListSuccess, chat_room.CCEH.onFetchRoomMemberListFail);
            }]);
        }
        else {
            chat_room.connection.dkarma.queryMemberListInfo(chat_room.ROOM_JID, chat_room.CCEH.onFetchRoomMemberListSuccess, chat_room.CCEH.onFetchRoomMemberListFail);
        }
    },
    //发送群组消息(外部调用)
    sendRoomMessage: function (message_text, html_message, time, msgid) {
        chat_room.chat_current_message_id = msgid;
        if (chat_room.connected) {
            chat_room.sendGroupMessage(message_text, html_message ? html_message : null, time, msgid);
        }
        else if (chat_room.roomconnected) {
            chatting.queyRoomInfoForJoin([function () {
                chat_room.sendGroupMessage(message_text, html_message ? html_message : null, time, msgid);
            }]);
        }
        else {
            chat_room.login(function (e) {
                chatting.queyRoomInfoForJoin([function () {
                    chat_room.sendGroupMessage(message_text, html_message ? html_message : null, time, msgid);
                }]);
            });
        }
    },
    //离线并登出
    chatLogOutAndOffline: function (_callback) {
        chatting.offline();
        chatting.loginOut(function (g) {
            console.log(g);
            var isadmin = (chat_SystemAdministrator + "@" + chat_domain) == g ? true : false;
            if (isadmin) {
                console.log("系统管理员连接已断开,即将链当前用户接进行操作");
            }
            else {
                console.log("当前用户连接已断开,即将链接系统管理员进行操作");
            }
            _callback();
        });
    },
    //离线并登出
    chatLogOutAndOfflineEx: function (_callback) {
        chatting.offline();
        chatting.loginOut(function (g) {
            console.log(g);
            console.log("当前用户链接已断开");
            _callback();
        });
    },
    //登录并加入
    chatLoginAndJoin: function (curUser, groupName, _call_back) {
        chatting.initGroup(curUser, groupName, chatting.receiveMessage);
        chatting.login(function (e) {
            chatting.queyRoomInfoForJoin([function () {
                console.log("当前用户已登录并以加入活动聊天室,已更新在线状态,可进行发送即时消息");
                if (_call_back) {
                    _call_back();
                }
                chatting.online();
            }]);
        });
    },
    //添加成员
    chatAdminAddMember: function (curUser, groupName, _preCallback, _callback) {
        _preCallback(function () {
            chatting.initGroup(chat_SystemAdministrator, groupName, null);
            chatting.addRoomMember(curUser, function () {
                console.log("成员授权完毕即将断开系统管理员链接,重新连接用户");
                chatting.chatLogOutAndOffline(function () {
                    _callback();
                });
            });
        });
    },
    //创建聊天室并添加成员
    chatAdminCreate: function (curUser, groupName, _preCallback, _callback) {
        _preCallback(function () {
            chatting.initGroup(chat_SystemAdministrator, groupName, null);
            chatting.setCreateStatus();
            chatting.queyRoomInfoForCreate(curUser, function () {
                console.log("房间创建完毕即将断开系统管理员链接,重新连接用户");
                chatting.chatLogOutAndOffline(function () {
                    chatting.cancelCreateStatus();
                    _callback();
                });
            });
        });

    },
    //接收群组消息
    receiveMessage: function (msg) {
        console.log(msg);
        console.log("检查是否为当前聊天室消息");
        if (msg.roomname == chat_room.ROOM_JID) {
            console.log("检查回调方法是否存在");
            if (chat_room.client_msg_callback) {
                console.log("开始检测是否为原始发送终端");
                if (chat_room.chat_current_message_id == msg.id) {
                    console.log("执行接收例程(原始发送方)");
                    chat_room.client_msg_callback(msg, true);
                }
                else {
                    console.log("执行接收例程(非原始)");
                    console.log("开始检测是否为原始发送终端");
                    chat_room.client_msg_callback(msg, false);
                }

            }
        }
    },
    //检查状态
    checkStatus: function (curUser, groupName, _receive_callback) {
        var canConnect = false;
        if (!chat_room.roomconnected) {
            canConnect = true;
        }
        else {
            if (chat_room.ROOM_JID != (groupName + '@' + chat_subdomain + "." + chat_domain)) {
                canConnect = true;
            }
        }
        chat_room.client_msg_callback = _receive_callback;
        return canConnect;
    }
}

//终端调用对象
var clientChat = {
    Chat: function (curUser, groupName, _receive_callback, _call_back) {
        if (curUser != "" && groupName != "") {
            if (chatting.checkStatus(curUser, groupName, _receive_callback)) {
                clientChat.JoinRoomChat(curUser, groupName, _call_back ? _call_back : null);
            }
        }
    },
    //加入活动会话，curUser:当前登录者accountid,groupName:活动id
    JoinRoomChat: function (curUser, groupName, _call_back) {
        chatting.initGroup(curUser, groupName, chatting.receiveMessage);
        chatting.login(function (e) {
            console.log(curUser + ":已登录");
            chatting.queryRoomForChoice(
                function (stanza, room) {
                    console.log("房间已存在,即将加入房间");
                    chatting.chatAdminAddMember(curUser, groupName,
                        function (pre_event_callback) {
                            chatting.chatLogOutAndOffline(pre_event_callback);
                        },
                        function () {
                            chatting.chatLoginAndJoin(curUser, groupName, _call_back ? _call_back : null);
                        });

                },
                function (stanza, room) {
                    console.log("房间不存在,开始断开当前用户连接");
                    chatting.chatAdminCreate(curUser, groupName,
                        function (pre_event_callback) {
                            chatting.chatLogOutAndOffline(pre_event_callback);
                        },
                        function () {
                            chatting.chatLoginAndJoin(curUser, groupName, _call_back ? _call_back : null);
                        });
                });
        });

    },
    LogOut: function (_callback) {
        chatting.chatLogOutAndOfflineEx(_callback);
    },
    SendJson: function (msg) {
        let send_msg = JSON.stringify(msg);
        var msgid = $.karmaGuid("N");
        let time = $.karmaFomateDate(new Date(), "YYYY-MM-DD hh:mm:ss");
        chatting.sendRoomMessage(send_msg, null, time, msgid);
    }
}


