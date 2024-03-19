import { Injectable } from '@angular/core';
import { ConfiguracionService, LoggingLevel } from './configuracion.service';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  private _level: LoggingLevel = LoggingLevel.Warnings;

  constructor(config: ConfiguracionService) { 
    if (config.loggingLevel) {
      this._level = config.loggingLevel;
    }
    console.log(`Nivel de loggeo=[${this._level}]`);
  }

  log(message: any, level = LoggingLevel.Warnings, ...optionalParams: any[]) {
    let fecha= new Date();
    let mensaje:string=`[${fecha.toISOString()}] ${message}`;
    if (this.mandarALog(level)) {
      switch (level) {
        case LoggingLevel.Errors:
          console.error(mensaje, optionalParams);
          break;
        case LoggingLevel.Warnings:
          console.warn(mensaje, optionalParams);
          break;
        case LoggingLevel.Info:
          console.info(mensaje, optionalParams);
          break;
        default:
          console.debug(mensaje, optionalParams);
      }
    }
  }

  private mandarALog(level: LoggingLevel) {
    if (this._level === LoggingLevel.None) {
      return false;
    } else if (this._level === LoggingLevel.Errors) {
      return level === LoggingLevel.Errors;
    } else if (this._level === LoggingLevel.Warnings) {
      return level === LoggingLevel.Errors || level === LoggingLevel.Warnings;
    } else if (this._level === LoggingLevel.Info) {
      return level === LoggingLevel.Errors || level === LoggingLevel.Warnings || level === LoggingLevel.Info;
    } else if (this._level === LoggingLevel.Verbose) {
      return level === LoggingLevel.Verbose || level === LoggingLevel.Errors || level === LoggingLevel.Warnings || level === LoggingLevel.Info;
    } else {
      return true;
    }
  }

  logError(message: any, ...optionalParams: any[]) {
    this.log(message, LoggingLevel.Errors, optionalParams);
  }
  
  logWarning(message: any, ...optionalParams: any[]) {
    this.log(message, LoggingLevel.Warnings, optionalParams);
  }
  
  logInfo(message: any, ...optionalParams: any[]) {
    this.log(message, LoggingLevel.Info, optionalParams);
  }
  
  logVerbose(message: any, ...optionalParams: any[]) {
    this.log(message, LoggingLevel.Verbose, optionalParams);
  }
}
