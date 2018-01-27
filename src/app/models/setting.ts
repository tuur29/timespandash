
import { environment } from 'environments/environment';

export class Setting {
  name: string;
  enabled: boolean;
  description: string;

  value?: string;
  type?: string; // number, date, text, select or empty for just checkbox
  options?: any[]; // in case of select type

  private initialEnabled: boolean;
  private initialValue: string;

  constructor(
    name: string,
    description: string,
    type?: string, options?: any[],
    initialEnabled?: boolean, initialValue?: string
  ) {

    this.name = name;
    this.description = description;
    this.enabled = false;
    this.type = type ? type : "";
    this.options = options ? options : [];
    this.value = this.type=="number" ? 0
      : (this.type=="select" ? this.options[0] : "");

    if (environment['settings'] && environment['settings'][name]) {
      if (environment['settings'][name]['enabled'])
        this.enabled = environment['settings'][name]['enabled'];
      if (environment['settings'][name]['value'])
        this.value = environment['settings'][name]['value'];
    }

    this.initialEnabled = initialEnabled ? initialEnabled : this.enabled;
    this.initialValue = initialValue ? initialValue : this.value;
  }

  getSetting(): any{
    if (this.type == "select") return this.value;
  	return this.enabled ? (this.value == "" ? this.enabled : this.value) : false;
  }

  reset() {
    this.enabled = this.initialEnabled;
    this.value = this.initialValue;
  }

  // make Webstorable
  save() {}
  
  static fromJSON(string: string) {
    let json = JSON.parse(string);
    return new Setting(json.name, json.description, json.type, json.options, json.initialEnabled, json.initialValue);
  }

}
