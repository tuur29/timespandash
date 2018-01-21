
export class Setting {
  enabled: boolean;
  description: string;

  value?: string;
  type?: string; // number, date, text or empty for just checkbox

  private initialEnabled: boolean;
  private initialValue: string;

  constructor(
    description: string,
    type?: string, value?: string, enabled?: boolean,
    initialEnabled?: boolean, initialValue?: string)
  {

    this.description = description;
    this.enabled = enabled ? enabled : false;
    this.type = type ? type : "";
    this.value = value ? value : "";

    this.initialEnabled = initialEnabled ? initialEnabled : this.enabled;
    this.initialValue = initialValue ? initialValue : this.value;
    
  }

  getSetting(): any{
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
    return new Setting(json.description, json.type, json.value, json.enabled, json.initialEnabled, json.initialValue);
  }

}
