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
  private minMinCost: number = 0.5;
  private minSMSCost: number = 0.5;
  private minMMSCost: number = 1.3;
  private isDaysOfUsage: boolean = false;
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

  calculatedataremainPlans() {
    var plan = $('#dataUsageUnitValue').val();
    var rate = $('#DataUsageInput').val();
    if (plan == 'kb' && rate != '') {
      return rate * 1e-6;
    }
    else if (plan == 'mb' && rate!='') {
      return rate * 0.001;
    }
    else if (plan == 'gb' && rate != '') {
      return rate * 1;
    }
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

    else {
      this.avialablePlans = [
        'AT&T Passport 1G ($60)',
        'AT&T Passport 3G ($120)'
      ];
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
    this.resetFields();
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
    if (this.dayUsage) {
      $(event.currentTarget).parent().removeClass('boredr-red');
    }
    else {
      $(event.currentTarget).parent().addClass('boredr-red');
    }
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
    else if (selectedOption == 'Canada and Mexico 80 Travel Minutes ($30)') {
      costValue = 30 * this.minMinCost;
      this.adjustmentrate = this.billedFinalValue - costValue;
      this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
    }
    else if (selectedOption == 'Canada and Mexico 200 Travel Minutes ($60)') {
      costValue = 60 * this.minMinCost;
      this.adjustmentrate = this.billedFinalValue - costValue;
      this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
    }
    else if (selectedOption == 'Canada and Mexico 500 Travel Minutes ($120)') {
      costValue = 120 * this.minMinCost;
      this.adjustmentrate = this.billedFinalValue - costValue;
      this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
    }
    else if (selectedOption == 'Canada and Mexico 1500 Travel Minutes ($240)') {
      costValue = 240 * this.minMinCost;
      this.adjustmentrate = this.billedFinalValue - costValue;
      this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
    }
    else if (selectedOption == 'International Day Pass') {
      this.isDaysOfUsage = true;
      $('#DaysOfUsageControl').parent().addClass('boredr-red');
      var dayUsageVal = $('#DaysOfUsageControl').val() ? parseInt($('#DaysOfUsageControl').val()) : 0;
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
    var costValue, minCostVal, currentValue;
    var selectedCountry = $('#selecteCountryControl option:selected').text();
    let textMessageVal = $('#textMessages').val() ? $('#textMessages').val() : 0;
    let voicemessageVal = $('#voiceMessages').val() ? $('#voiceMessages').val() : 0;
    if (selectedCountry == 'Canada' || selectedCountry == 'Mexico') {
      costValue = this.checkMinPlanVal() + textMessageVal * 0.5 + voicemessageVal * 1.3;
    }
    else if (selectedCountry == 'Cruise Ships') {
      costValue = this.checkMinPlanVal();
    }
    else {
      currentValue = $('#VoiceRoamingMinutes').val();
      minCostVal = currentValue * this.minCost;
      costValue = this.checkMinPlanVal() + minCostVal;
    }
    if (this.billedFinalValue != 0 && this.billedFinalValue != null) {
      this.adjustmentrate = this.billedFinalValue - costValue;
      this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
    }
    else {
      this.adjustmentrate = costValue;
      this.remaingRoamingCharges = this.adjustmentrate;
    }
    
  }
  calculateGBVal(): any {
    let oneMbPlan;
    let gbVal = $('#DataUsageInput').val() ? $('#DataUsageInput').val() :0;
    let selcetedMbplan = $('#selectDataChosePlan').val();
    let selectedCountry = $('#selecteCountryControl').val();
    if (selectedCountry == 'Canada' || selectedCountry == 'Mexico') {
      oneMbPlan = 2.048;
    }
    else if (selectedCountry == 'Cruise Ships') {
      oneMbPlan = 6.144;
    }
    else {
      oneMbPlan = 2.048;
    }
    if (selcetedMbplan == 'Kb') {
      return (gbVal / 1024) * oneMbPlan;
    }
    else if (selcetedMbplan == 'mb') {
      return gbVal * oneMbPlan;
    }

    else if (selcetedMbplan == 'gb') {
      return gbVal * 1024 * oneMbPlan;
    }
    else {
      return gbVal * 1024 * oneMbPlan;
    }
  }
  checkMinPlanVal():any {
    if (!this.internationalDayPassSelected) {
      var selectedCountry = $('#selecteCountryControl option:selected').text();
      let selecteddataPlan = $('#selectDataChosePlan').val();
      if (selectedCountry == 'Canada' || selectedCountry == 'Mexico') {
        let dataUsageCost = $('#VoiceRoamingMinutes').val() ? parseInt($('#VoiceRoamingMinutes').val()) : 0;
        if (dataUsageCost <= 80) {
          this.cost = 'Canada and Mexico 80 Travel Minutes ($30)';
          return 80 * 0.5 + parseInt(this.calculateGBVal());
        }
        else if (dataUsageCost > 80 && dataUsageCost <= 200) {
          this.cost = 'Canada and Mexico 200 Travel Minutes ($60)';
          let minUsage = dataUsageCost - 80;
          return 60 + minUsage * 0.5 + parseInt(this.calculateGBVal());
        }
        else if (dataUsageCost > 200 && dataUsageCost <= 500) {
          this.cost = 'Canada and Mexico 500 Travel Minutes ($120)';
          let minUsage = dataUsageCost - 80;
          return 120 + minUsage * 0.5 + parseInt(this.calculateGBVal());
        }
        else if (dataUsageCost > 500) {
          this.cost = 'Canada and Mexico 1500 Travel Minutes ($240)';
          let minUsage = dataUsageCost - 80;
          return 120 + minUsage * 0.5 + parseInt(this.calculateGBVal());
        }
      }
      else if (selectedCountry == 'Cruise Ships') {
        let dataUsageCost = $('#VoiceRoamingMinutes').val() ? parseInt($('#VoiceRoamingMinutes').val()) : 0;
        if (dataUsageCost <= 50) {
          this.cost = 'AT & T Cruise Talk & Text($50)';
          return 50* 2 + this.calculateGBVal();
        }
        else {
          this.cost = 'AT & T Cruise Talk, Text & Data($100)';
          return 100 + this.calculateGBVal();
        }
      }
      else {
        let dataUsageCost = $('#DataUsageInput').val() ? parseInt($('#DataUsageInput').val()) : 0;
        
        if (selecteddataPlan == 'gb') {
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
        else if (selecteddataPlan == 'Kb') {
          if (dataUsageCost <= 1048576) {
            this.cost = 'AT&T Passport 1GB($60)';
            return this.minPlanOnegbVal;
          }
          else if (dataUsageCost > 1048576 && dataUsageCost <= 2097150) {
            this.cost = 'AT&T Passport 1GB($60)';
            return 1 * 50 + this.minPlanOnegbVal;
          }
          else if (dataUsageCost > 2097150 && dataUsageCost <= 3145728) {
            this.cost = 'AT&T Passport 3GB($120)';
            return this.minPlanThreegbVal;
          }
          else if (dataUsageCost > 3145728) {
            this.cost = 'AT&T Passport 1GB($60)';
            let gbdata: any = (dataUsageCost / 1024) / 1024;
            return parseInt(gbdata) * 50 + this.minPlanOnegbVal;
          }
          else {
            this.cost = 'AT&T Passport 1GB($60)';
            return this.minPlanThreegbVal;
          }
        }
        else if (selecteddataPlan == 'mb') {
          if (dataUsageCost <= 1024) {
            this.cost = 'AT&T Passport 1GB($60)';
            return this.minPlanOnegbVal;
          }
          else if (dataUsageCost > 1024 && dataUsageCost <= 2048) {
            this.cost = 'AT&T Passport 1GB($60)';
            return 50 + this.minPlanOnegbVal;
          }
          else if (dataUsageCost > 2048 && dataUsageCost <= 3072) {
            this.cost = 'AT&T Passport 3GB($120)';
            return this.minPlanThreegbVal;
          }
          else if (dataUsageCost > 3072) {
            this.cost = 'AT&T Passport 3GB($120)';
            var mbData: any = dataUsageCost / 1024;
            return parseInt(mbData) - 1 + this.minPlanThreegbVal;
          }
          else {
            this.cost = 'AT&T Passport 1GB($60)';
            return this.minPlanThreegbVal;
          }
        }
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
  resetFields() {
    $('#VoiceRoamingValue').val('');
    $('#TextMessagesValue').val('');
    $('#PictureVideoValue').val('');
    $('#DataUsageKitValue').val('');
    $('#BilledInternatonalFeatureValue').val('');
    $('#DayUsagetextbox').val('');
    this.billedFinalValue = null;
    $('#VoiceRoamingMinutes').val('');
    $('#textMessages').val('');
    $('#voiceMessages').val('');
    $('#DataUsageInput').val('');
    this.isShowRerateCalcOptions = false;
    $('#AvilableReratePlan').attr('disabled', true);
    $('#OverrideReratePlan').attr('disabled', true);
    $('#NegotiateReratePlan').attr('disabled', true);
    $('#BestReratePlan').attr('disabled', true);
    this.isShowBestPlan = true;
    this.isShowAvailableplans = false;
    this.isShowoverridePlans = false;
    this.isShownegotiatePlans = false;
    this.adjustmentrate = null;
    this.remaingRoamingCharges = null;
    this.cost = '';
    $('#DayUsagetextbox').parent().removeClass('boredr-red');
    this.isDaysOfUsage = false;
  }
}

