
class CommandHistory {
    static history = [];

     static addOrUpdateCommandHistory = (user, commandText, step = 0, state = null) => {
        const command = CommandHistory.history.find(c => c.user.id == user.id) ?? {};
        let wasExist = command.user ?? false;
        command.user = user;
        command.command = commandText;
        command.step = step;
        command.state = state;
        if(wasExist)
            CommandHistory.history = CommandHistory.history.map(ch => ch.user.id == user.id ? command : ch)
        else
            CommandHistory.history.push(command);
    }
    static deleteCommandHistoryIfExist = (user) => {
       if(CommandHistory.history.length == 0) return;
        const index = CommandHistory.history.findIndex(c => c.user.id == user.id);
        if(index != undefined || index != null) {
            CommandHistory.history.splice(index, 1);
        }
    }
}





module.exports = CommandHistory;