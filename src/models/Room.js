class Room {
    constructor(data = {}) {
        this.roomId = null;
        this.currentGameId = null;
        this.userIds= null;
        Object.assign(this, data);
    }

}
export default Room;