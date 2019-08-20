export default class Sample {
  constructor(stringToWrite) {
    this.text = stringToWrite;
  }

  writeToConsole() {
    console.log(this.text);
  }
}
