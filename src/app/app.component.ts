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
  private cost: string ='';
  private note: string;
  private minPlanOnegbVal: number = 60;
  private minPlanThreegbVal: number = 120;  
  private minCost: number = 0.35;
  private remaingRoamingCharges;
  private isShowBestPlan: boolean = true;
  private isShowAvailableplans: boolean = false;
  private isShowoverridePlans: boolean = false;
  private isShownegotiatePlans: boolean = false;
  private adjustmentrate: number;
  private isShowRerateCalcOptions: boolean = false;
  private internationalDayPassSelected: boolean = false;
  private dayUsage: number;
  private avialablePlans = [
    'AT&T Passport 1G ($60)',
    'AT&T Passport 3G ($120)'
  ];
  private billedFinalValue = 0;
  constructor() {

  }
  ngOnInit() {
   
  }
  showreRateOptions() {
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
      this.avialablePlans = ['AT&T Passport 1GB ($60)',
         'AT&T Passport 3GB ($120)',
        'Canada and Mexico 80 Travel Minutes ($30)',
        'Canada and Mexico 200 Travel Minutes ($60)',
        'Canada and Mexico 500 Travel Minutes ($120)',
        'Canada and Mexico 1500 Travel Minutes ($240)']
    }
    else if (selectedCountry == 'Cruise Ships') {
      this.avialablePlans = ['AT & T Cruise Talk & Text($50)', 'AT & T Cruise Talk, Text & Data($100)'];
      this.cost = 'AT & T Cruise Talk & Text($50)';
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
      }
    });
    this.isShowRerateCalcOptions = false;
    $('#AvilableReratePlan').attr('disabled', true);
    $('#OverrideReratePlan').attr('disabled', true);
    $('#NegotiateReratePlan').attr('disabled', true);
    $('#BestReratePlan').attr('disabled', true);
    this.isShowBestPlan = true;
    this.isShowAvailableplans = false;
    this.isShowoverridePlans = false;
    this.isShownegotiatePlans = false;
  }
  eligiblePlan() {
    var currentOption = $(event.currentTarget).val();
    if (currentOption == 'Yes') {
      $('#DayUsagetextbox').removeAttr("disabled");
      this.internationalDayPassSelected = true;
      this.cost = 'AT&T international Day Pass';
      this.avialablePlans.push('AT&T international Day Pass');
    }
    else {
      $('#DayUsagetextbox').attr('disabled', 'disabled');
      this.internationalDayPassSelected = false;
      this.cost = 'AT&T Passport 1GB ($60)';
      this.avialablePlans.pop();
    }
    this.calCulateFinalVal();
  }

  ChangeInternlPlans(event) {
    this.dayUsage = $(event.currentTarget).val();
    if (this.dayUsage < 6) {
      this.cost = 'AT&T international Day Pass';
    }
    else if (this.dayUsage > 6) {
      this.cost = 'AT&T Passport 1GB ($60)'
    }
    this.calCulateFinalVal();
  }

  applyCharges(event) {
    var costValue, selectedOption,dayUsageCost;
    var planname = $(event.currentTarget).attr('plan');
    if (planname == 'availableplans') {
      selectedOption = $('#AdditionalreRateSelect2').val();
    }
    else if (planname == 'overrideplan') {
      selectedOption = $('#ManageOverridePlansSelect2').val();
    }
    else if (planname == 'negotiateplan') {
      var negotiateVal = $('#NegatiatePercentage').val() ? parseInt($('#NegatiatePercentage').val()) : 0;
      negotiateVal = (this.billedFinalValue / 100) * negotiateVal;
      this.adjustmentrate = this.billedFinalValue - negotiateVal;
      this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
    }
    if (selectedOption == 'AT&T Passport 1G ($60)') {
      costValue = 60;
      this.adjustmentrate = this.billedFinalValue - costValue;
      this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
    }

    else if (selectedOption == 'AT&T Passport 3G ($120)') {
      costValue = 120;
      this.adjustmentrate = this.billedFinalValue - costValue;
      this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
    }
    else if (selectedOption == 'International Day Pass') {
      $('#DayUsagetextbox').removeAttr("disabled");
      var dayUsageVal = $('#DayUsagetextbox').val() ? parseInt($('#DayUsagetextbox').val()) : 0;
      if (dayUsageVal <= 5) {
        dayUsageCost = dayUsageVal * 10;
      }
      else {
        dayUsageCost = 60;
      }
      this.adjustmentrate = this.billedFinalValue - dayUsageCost;
      this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
    }
    
  }

  calCulateFinalVal(rerateChage?) {
    var costValue;
    var currentValue = $('#VoiceRoamingMinutes').val();
    var minCostVal = currentValue * this.minCost;
    costValue = this.checkMinPlanVal() + minCostVal;
    this.adjustmentrate = this.billedFinalValue - costValue;
    this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
  }

  checkMinPlanVal() {
    if (!this.internationalDayPassSelected) {
      let dataUsageCost = $('#DataUsageInput').val() ? parseInt($('#DataUsageInput').val()) : 0;
      if (dataUsageCost <= 1) {
        this.cost = 'AT&T Passport 1GB($60)';
        return this.minPlanOnegbVal;
      }
      else if (dataUsageCost == 2) {
        this.cost = 'AT&T Passport 1GB($60)';
        return (dataUsageCost - 1) * 50 + this.minPlanOnegbVal;
      }
      else if (dataUsageCost == 3) {
        this.cost = 'AT&T Passport 3GB($120)';
        return this.minPlanThreegbVal;
      }
      else if (dataUsageCost > 3) {
        this.cost = 'AT&T Passport 3GB($120)';
        return (dataUsageCost - 1) * 50 + this.minPlanThreegbVal;
      }
      else {
        return this.minPlanOnegbVal;
      }
    }
    else {
      this.dayUsage = $('#DayUsagetextbox').val();
      if (this.dayUsage <= 5) {
        this.cost = 'AT&T international Day Pass';
        return this.dayUsage * 10;
      }
      else{
        this.cost = 'AT&T Passport 1GB($60)';
        return 60;
      }
    }
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
        $('#ApplyChargeButton').attr('plan', 'bestplan');

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
        $('#ApplyChargeButton').attr('plan', 'availableplans');
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
        $('#ApplyChargeButton').attr('plan', 'overrideplan');
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
        $('#ApplyChargeButton').attr('plan', 'negotiateplan');
        break;
        default:
        $('#ApplyChargeButton').attr('plan', 'bestplan');
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
    this.billedFinalValue = Number(voiceValue) + Number(textmessageValue) + Number(pictureVideoVal) + Number(dataUsageKitVal) + Number(buildIntlValue);
    this.calCulateFinalVal();
  }

  checkPercentage(event){
  
    var value=parseInt($(event.currentTarget).val())
    if(value>100){
      $(event.currentTarget).val('0');
      return false;
    }
  }

}

