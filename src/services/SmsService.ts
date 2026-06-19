import axios from "axios";
import xml2js from "xml2js";

class SmsService {
  private username: string;
  private password: string;
  private baseUrlSend: string;

  constructor(username: string, password: string) {
    this.username = username;
    this.password = password;
    this.baseUrlSend = "http://api.payamak-panel.com/post/send.asmx";
  }

  private _extractValue(field: any): string | null {
    if (!field) return null;
    if (typeof field === "string") return field;
    if (typeof field === "object" && field._ !== undefined) return field._;
    if (typeof field === "object" && field["$"] && field._ !== undefined)
      return field._;
    return String(field);
  }

  async sendByBaseNumber(text: string, to: string, bodyId: string) {
    try {
      const url = `${this.baseUrlSend}/SendByBaseNumber2`;
      const params = {
        username: this.username,
        password: this.password,
        text: text,
        to: to,
        bodyId: bodyId,
      };

      const response = await axios.get(url, { params });
      const data = response.data.trim();

      const parser = new xml2js.Parser({ explicitArray: false, trim: true });
      const parsed = await parser.parseStringPromise(data);

      let rawResult: any = null;
      if (parsed["soap:Envelope"] && parsed["soap:Envelope"]["soap:Body"]) {
        const bodyNode = parsed["soap:Envelope"]["soap:Body"];
        const responseNode = bodyNode["SendByBaseNumber2Response"];
        if (
          responseNode &&
          responseNode["SendByBaseNumber2Result"] !== undefined
        ) {
          rawResult = responseNode["SendByBaseNumber2Result"];
        }
      } else if (parsed["string"] !== undefined) {
        rawResult = parsed["string"];
      } else if (parsed["SendByBaseNumber2Result"] !== undefined) {
        rawResult = parsed["SendByBaseNumber2Result"];
      } else {
        rawResult = data;
      }

      const result = this._extractValue(rawResult);

      if (result && /^\d{15,}$/.test(result.toString())) {
        return {
          success: true,
          recId: result,
          message: "SMS sent successfully",
        };
      } else {
        return { success: false, errorCode: result };
      }
    } catch (error: any) {
      throw new Error(`Error sending SMS: ${error.message}`);
    }
  }
}

export default SmsService;
