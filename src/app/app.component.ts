import { Component,OnInit } from '@angular/core';
import { ReRateMasaters } from '../global/global-service'
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'reRate-calculator';
  rerateData = ReRateMasaters;
  private daypass: boolean = false;
  private passport: boolean = false;
  private wificall: boolean = false;
  private ppurates: boolean = false;
  private domesticeligibility: boolean = false;
  private cost: number;
  private note: string;
  private isShowBestPlan: boolean = true;
  private isShowAvailableplans: boolean = false;
  private isShowoverridePlans: boolean = false;
  private isShownegotiatePlans: boolean = false;
  private adjustmentrate: number;
  private roamingcharges: number;
  private isShowRerateCalcOptions: boolean = false;
  private avialablePlans = [
    'AT&T Passport 1G ($60)',
    'AT&T Passport 3G ($120)'
  ];
  private billedFinalValue = 0;
  constructor() {

  }
  ngOnInit() {
   
  }
  showreRateOptions(event) {
    this.isShowRerateCalcOptions = true;
    $('#AvilableReratePlan').attr('disabled', false);
    $('#OverrideReratePlan').attr('disabled', false);
    $('#NegotiateReratePlan').attr('disabled', false);
    $('#BestReratePlan').attr('disabled', false);

  }
  changeCountry(event) {
    let self = this;
    var selectedCountry = event.currentTarget.value;
   // print(filtered);
    if (selectedCountry == 'Canada' || selectedCountry == 'Mexico') {
      this.avialablePlans = ['Canada and Mexico 80 Travel Minutes ($30)',
        'Canada and Mexico 200 Travel Minutes ($60)',
        'Canada and Mexico 500 Travel Minutes ($120)',
        'Canada and Mexico 1500 Travel Minutes ($240)']
    }
    else if (selectedCountry == 'Cruise ship') {
      this.avialablePlans = ['AT & T Cruise Talk & Text($50)', 'AT & T Cruise Talk, Text & Data($100)']
    }
    $.map(this.rerateData, function (val, i) {
      if (val.country == selectedCountry) {
        self.passport = val.passport;
        self.wificall = val.wificall;
        self.ppurates = val.ppurates;
        self.daypass = val.daypass;
        self.domesticeligibility = val.domesticeligibility;
        self.cost = val.cost;
        self.note = val.note;
        self.adjustmentrate = val.adjustmentrate;
        self.roamingcharges = val.roamingcharges;
      }
    });
  }
  eligiblePlan() {
    $('#DayUsagetextbox').removeAttr("disabled");

  }

  reRatePlanChange(event) {
    var selectedPlan = $(event.currentTarget).attr('data-planname');
    switch (selectedPlan){
      case 'bestplan':
        this.isShowBestPlan = true;
        this.isShowAvailableplans = false;
        this.isShowoverridePlans = false;
        this.isShownegotiatePlans = false;
        $('#AvilableReratePlan').attr('disabled', true);
        $('#OverrideReratePlan').attr('disabled', true);
        $('#NegotiateReratePlan').attr('disabled', true);
        $('#BestReratePlan').attr('disabled', false);


        break;
      case 'availableplans':
        this.isShowBestPlan = false;
        this.isShowAvailableplans = true;
        this.isShowoverridePlans = false;
        this.isShownegotiatePlans = false;
        $('#AvilableReratePlan').attr('disabled', false);
        $('#OverrideReratePlan').attr('disabled', true);
        $('#NegotiateReratePlan').attr('disabled', true);
        $('#BestReratePlan').attr('disabled', true);
        break;
      case 'overrideplan':
        this.isShowBestPlan = false;
        this.isShowAvailableplans = false;
        this.isShowoverridePlans = true;
        this.isShownegotiatePlans = false;
        $('#AvilableReratePlan').attr('disabled', true);
        $('#OverrideReratePlan').attr('disabled', false);
        $('#NegotiateReratePlan').attr('disabled', true);
        $('#BestReratePlan').attr('disabled', true);
        break;
      case 'negotiateplan':
        this.isShowBestPlan = false;
        this.isShowAvailableplans = false;
        this.isShowoverridePlans = false;
        this.isShownegotiatePlans = true;
        $('#AvilableReratePlan').attr('disabled', true);
        $('#OverrideReratePlan').attr('disabled', true);
        $('#NegotiateReratePlan').attr('disabled', false);
        $('#BestReratePlan').attr('disabled', true);
        break;
    }


  }

  caculcateBilledUsage() {
    let voiceValue = $('#VoiceRoamingValue').val();
    let textmessageValue = $('#TextMessagesValue').val();
    let pictureVideoVal = $('#PictureVideoValue').val();
    let dataUsageKitVal = $('#DataUsageKitValue').val();
    let buildIntlValue = $('#BilledInternatonalFeatureValue').val();
    let dataUsageValue = $('#DayUsagetextbox').val();
    this.billedFinalValue = Number(voiceValue) + Number(textmessageValue) + Number(pictureVideoVal) + Number(dataUsageKitVal) + Number(buildIntlValue) + Number(dataUsageValue);
  }
}

