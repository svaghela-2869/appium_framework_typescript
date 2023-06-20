interface String {
    equals(other: any): boolean;
    equalsIgnoreCase(other: any): boolean;
}
String.prototype.equals = function (other: any) {
    return !other || (!(typeof other === "string") && !(other instanceof String)) || this.length != other.length ? false : this.valueOf() === other.valueOf();
};
String.prototype.equalsIgnoreCase = function (other: any) {
    return !other || (!(typeof other === "string") && !(other instanceof String)) || this.length != other.length ? false : this === other || this.toLowerCase() === other.toLowerCase();
};
