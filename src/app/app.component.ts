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
  private selectedCountryVal: string = '';
  private cost: string ='';
  private selectedValue: string = '';
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
    'AT&T Passport 1GB ($60)',
    'AT&T Passport 3GB ($120)'
  ];
  private billedFinalValue = 0;
  constructor() {

  }

  ngOnInit() {
  }

  showreRateOptions() {
    this.isShowRerateCalcOptions = true;
    var managePlan = $('#ManageOverridePlansSelect2').val();
    if (managePlan == "International Day Pass") {
      this.isDaysOfUsage = true;
    }
    else {
      this.isDaysOfUsage = false;
    }
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
    self.selectedCountryVal = selectedCountry;
    if (selectedCountry == 'Canada' || selectedCountry == 'Mexico') {
      this.avialablePlans = ['AT&T Passport 1GB ($60)',
        'AT&T Passport 3G ($120)',
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
        'AT&T Passport 1GB ($60)',
        'AT&T Passport 3GB ($120)'
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
    this.resetFields()
  }
  eligiblePlan() {
    var currentOption = $(event.currentTarget).val();
    this.selectedValue = currentOption;
    if (currentOption == 'Yes') {
      $('#DayUsagetextbox').removeAttr("disabled");
      this.internationalDayPassSelected = true;
      this.cost = 'AT&T international Day Pass';
      this.avialablePlans.push('AT&T international Day Pass');
    }
    else {
      $('#DayUsagetextbox').attr('disabled', 'disabled');
      this.internationalDayPassSelected = false;
      $('#DayUsagetextbox').val('');
      this.cost = 'AT&T Passport 1GB ($60)';
      //this.avialablePlans.pop();
    }

    this.calCulateFinalVal();
  }

  ChangeInternlPlans(event) {
      this.dayUsage = $(event.currentTarget).val();
    if (this.dayUsage ) {
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
  onBlurMethod(event) {
    var currentOption = $(event.currentTarget).val();
    
    if (currentOption == "Yes") {
      $(event.currentTarget).parent().removeClass('boredr-red');
    }
    else {
     
    }    
  }

  applyCharges(event) {
    var costValue, selectedOption, dayUsageCost, minCostVal, currentValue;
    var selectedCountry = $('#selecteCountryControl').val();
    let textMessageVal = $('#textMessages').val() ? $('#textMessages').val() : 0;
    let voicemessageVal = $('#voiceMessages').val() ? $('#voiceMessages').val() : 0;
    var planname = $("#ApplyChargeButton").attr('plan');
    currentValue = $('#VoiceRoamingMinutes').val();
    if (planname == 'availableplans') {
      selectedOption = $('#AdditionalreRateSelect2').val();
    }
    else if (planname == 'overrideplan') {
      selectedOption = $('#ManageOverridePlansSelect2').val();
    }
    else if (planname == 'negotiateplan') {
      this.isDaysOfUsage = false;
      var negotiateVal = $('#NegatiatePercentage').val() ? parseInt($('#NegatiatePercentage').val()) : 0;
      costValue = (this.billedFinalValue / 100) * negotiateVal;
    }
    if (selectedOption == 'AT&T Passport 1GB ($60)' || selectedOption == 'AT&T Passport 1G ($60)') {
      this.isDaysOfUsage = false;
      minCostVal = currentValue * this.minCost;
      costValue = 60 + minCostVal + this.calculateRerateDayUsageValue('1GB');
    }

    else if (selectedOption == 'AT&T Passport 3GB ($120)' || selectedOption == 'AT&T Passport 3G ($120)') {
      this.isDaysOfUsage = false;
      minCostVal = currentValue * this.minCost;
      costValue =  120 + minCostVal + this.calculateRerateDayUsageValue('3GB');;
      
    }
    else if (selectedOption == 'Canada and Mexico 80 Travel Minutes ($30)') {
      this.isDaysOfUsage = false;
      costValue = 30 + textMessageVal * 0.5 + voicemessageVal * 1.3;
    }
    else if (selectedOption == 'Canada and Mexico 200 Travel Minutes ($60)') {
      this.isDaysOfUsage = false;
      costValue = 60 + textMessageVal * 0.5 + voicemessageVal * 1.3;
    }
    else if (selectedOption == 'Canada and Mexico 500 Travel Minutes ($120)') {
      this.isDaysOfUsage = false;
      costValue = 120 + textMessageVal * 0.5 + voicemessageVal * 1.3;
    }
    else if (selectedOption == 'Canada and Mexico 1500 Travel Minutes ($240)') {
      this.isDaysOfUsage = false;
      costValue = 240 + textMessageVal * 0.5 + voicemessageVal * 1.3;
    }
    else if (selectedOption == 'AT & T Cruise Talk & Text($50)') {
      this.isDaysOfUsage = false;
      costValue = this.checkMinPlanVal() + currentValue * 2;
      
    }
    else if (selectedOption == 'AT & T Cruise Talk, Text & Data($100)') {
      this.isDaysOfUsage = false;
      costValue = 100;
    }
    else if (selectedOption == 'AT&T international Day Pass' || selectedOption == 'International Day Pass') {
      this.isDaysOfUsage = true;
      $('#DaysOfUsageControl').parent().addClass('boredr-red');
      var dayUsageVal = $('#DaysOfUsageControl').val() ? parseInt($('#DaysOfUsageControl').val()) : 0;
      if (dayUsageVal <= 5) {
        costValue = dayUsageVal * 10;
      }
      else {
        costValue = 60;
      }
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

  calCulateFinalVal(rerateChage?) {
    var costValue, minCostVal, currentValue;
    var selectedCountry = $('#selecteCountryControl option:selected').text();
    let textMessageVal = $('#textMessages').val() ? $('#textMessages').val() : 0;
    let voicemessageVal = $('#voiceMessages').val() ? $('#voiceMessages').val() : 0;
    if (selectedCountry == 'Canada' || selectedCountry == 'Mexico') {
      costValue = this.checkMinPlanVal() + textMessageVal * 0.5 + voicemessageVal * 1.3;
    }
    else if (selectedCountry == 'Cruise Ships') {
      currentValue = $('#VoiceRoamingMinutes').val();
      if (this.calculateGBVal() < 100) {
        costValue = this.checkMinPlanVal() + currentValue * 2;
      }
      else {
        costValue = this.checkMinPlanVal();
      }
    }
    else if (this.internationalDayPassSelected) {
      currentValue = $('#VoiceRoamingMinutes').val();
      minCostVal = currentValue * this.minCost;
      var roamingVal = $('#VoiceRoamingMinutes').val();
      var dataVal = $('#DataUsageInput').val();
      if (roamingVal != '' || dataVal != '') {
        costValue = this.checkMinPlanVal() + minCostVal;
      }
      else {
        costValue = null;
      }
    }
    else {
      currentValue = $('#VoiceRoamingMinutes').val();
      minCostVal = currentValue * this.minCost;
      var roamingVal = $('#VoiceRoamingMinutes').val();
      var dataVal = $('#DataUsageInput').val();
      if (roamingVal != '' || dataVal != '') {
        costValue = this.checkMinPlanVal() + minCostVal;
      }
      else {
        costValue = null;
      }
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
      if (selcetedMbplan == 'Kb' && gbVal <= 8350) {
        return 50 + (parseInt(gbVal)/1024) * oneMbPlan;
      }
      else {
        return 100;
      }
    }
    else {
      oneMbPlan = 2.048;
    }

    if (selcetedMbplan == 'Kb') {
      return (gbVal / 1000) * oneMbPlan;
    }
    else if (selcetedMbplan == 'mb') {
      return gbVal * oneMbPlan;
    }

    else if (selcetedMbplan == 'gb') {
      return gbVal * 1000 * oneMbPlan;
    }
    else {
      return gbVal * 1000 * oneMbPlan;
    }
  }
  checkMinPlanVal(): any {
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
        if (this.calculateGBVal() < 100) {
          this.cost = 'AT & T Cruise Talk & Text($50)';
          return this.calculateGBVal();
        }
        else {
          this.cost = 'AT & T Cruise Talk, Text & Data($100)';
          return 100;
        }
      }
      else {
        return this.calculateDayeUsageValue();
      }
    }
    else {
      if (this.isDaysOfUsage) {
        this.dayUsage = $('#DaysOfUsageControl').val();
      } else {
        this.dayUsage = $('#DayUsagetextbox').val();
      }
      
      if (this.dayUsage <= 5) {
        this.cost = 'AT&T International Day Pass';
        return this.dayUsage * 10 + this.calculateDayeUsageValue();
      }
      else {
       return  this.calculateDayeUsageValue();
      }
    }
  }
  
  calculateDayeUsageValue() {
    let selecteddataPlan = $('#selectDataChosePlan').val();
    var dayUsageValue;
    if (this.isDaysOfUsage) {
      dayUsageValue = $('#DaysOfUsageControl').val();
    } else {
      dayUsageValue = $('#DayUsagetextbox').val();
    }
    let dataUsageCost = $('#DataUsageInput').val() ? parseInt($('#DataUsageInput').val()) : 0;
    if (selecteddataPlan == 'gb') {
      if (dataUsageCost <= 1) {

        if (this.internationalDayPassSelected && dayUsageValue <= 5) {
          this.cost = 'AT&T International Day Pass';
        }
        else {
          this.cost = 'AT&T Passport 1GB ($60)';
        }
        
        return this.minPlanOnegbVal;
      }
      else if (dataUsageCost == 2) {
        if (this.internationalDayPassSelected && dayUsageValue <= 5) {
          this.cost = 'AT&T International Day Pass';
        }
        else {
          this.cost = 'AT&T Passport 1GB ($60)';
        }
        return (dataUsageCost - 1) * 50 + this.minPlanOnegbVal;
      }
      else if (dataUsageCost == 3) {
        this.cost = 'AT&T Passport 3GB($120)';
        return this.minPlanThreegbVal;
      }
      else if (dataUsageCost > 3) {
        this.cost = 'AT&T Passport 3GB($120)';
        return (dataUsageCost - 3) * 50 + this.minPlanThreegbVal;
      }
      else {
        return this.minPlanOnegbVal;
      }
    }
    else if (selecteddataPlan == 'Kb') {
      if (dataUsageCost <= 1000000) {
        if (this.internationalDayPassSelected && dayUsageValue <= 5) {
          this.cost = 'AT&T International Day Pass';
        }
        else {
          this.cost = 'AT&T Passport 1GB ($60)';
        }
        return this.minPlanOnegbVal;
      }
      else if (dataUsageCost > 1000000 && dataUsageCost <= 2000000) {
        if (this.internationalDayPassSelected && dayUsageValue <= 5) {
          this.cost = 'AT&T International Day Pass';
        }
        else {
          this.cost = 'AT&T Passport 1GB ($60)';
        }
        return 1 * 50 + this.minPlanOnegbVal;
      }
      else if (dataUsageCost > 2000000 && dataUsageCost <= 3000000) {
        this.cost = 'AT&T Passport 3GB($120)';
        return this.minPlanThreegbVal;
      }
      else if (dataUsageCost > 3000000) {
        this.cost = 'AT&T Passport 3GB($120)';
        let gbdata: any = (dataUsageCost - 3000000) / 1000000;
        return parseInt(gbdata) * 50 + this.minPlanThreegbVal;
      }
      else {
        this.cost = 'AT&T Passport 1GB($60)';
        return this.minPlanThreegbVal;
      }
    }
    else if (selecteddataPlan == 'mb') {
      if (dataUsageCost <= 1000) {
        if (this.internationalDayPassSelected && dayUsageValue <= 5) {
          this.cost = 'AT&T International Day Pass';
        }
        else {
          this.cost = 'AT&T Passport 1GB ($60)';
        }
        return this.minPlanOnegbVal;
      }
      else if (dataUsageCost > 1000 && dataUsageCost <= 2000) {
        if (this.internationalDayPassSelected && dayUsageValue <= 5) {
          this.cost = 'AT&T International Day Pass';
        }
        else {
          this.cost = 'AT&T Passport 1GB ($60)';
        }
        return 50 + this.minPlanOnegbVal;
      }
      else if (dataUsageCost > 2000 && dataUsageCost <= 3000) {
        this.cost = 'AT&T Passport 3GB ($120)';
        return this.minPlanThreegbVal;
      }
      else if (dataUsageCost > 3000) {
        this.cost = 'AT&T Passport 3GB ($120)';
        var mbData: any = dataUsageCost / 1000;
        return parseInt(mbData) - 3 + this.minPlanThreegbVal;
      }
      else {
        this.cost = 'AT&T Passport 1GB ($60)';
        return this.minPlanThreegbVal;
      }
    }
  }


  calculateRerateDayUsageValue(planvalue) {
    debugger;
    let selecteddataPlan = $('#selectDataChosePlan').val();
    let dataUsageCost = $('#DataUsageInput').val() ? parseInt($('#DataUsageInput').val()) : 0;

    if (selecteddataPlan == 'gb') {
      if (planvalue == '1GB') {
        if (dataUsageCost <= 1) {
          return 0;
        }
        else {
          return (dataUsageCost - 1) * 50;
        }
      }
      else {
        if (dataUsageCost <= 3) {
          return 0;
        }
        else {
          return (dataUsageCost - 3) * 50;
        }
      }

    }
    else if (selecteddataPlan == 'Kb') {
      if (planvalue == '1GB') {
        if (dataUsageCost <= 1000000) {
          return 0;
        }
        else {
          return (dataUsageCost - 1000000) * 50;
        }
      }
      else {
        if (dataUsageCost <= 3000000) {
          return 0;
        }
        else {
          return (dataUsageCost - 3000000) * 50;
        }
      }
     
    }
    else if (selecteddataPlan == 'mb') {
      if (planvalue == '1GB') {
        if (dataUsageCost <= 1000) {
          return 0;
        }
        else {
          return (dataUsageCost - 1000) * 50;
        }
      }
      else {
        if (dataUsageCost <= 3000) {
          return 0;
        }
        else {
          return (dataUsageCost - 3000) * 50;
        }
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
        this.isDaysOfUsage = false;
        // $('#AvilableReratePlan').attr('disabled', true);
        // $('#OverrideReratePlan').attr('disabled', true);
        // $('#NegotiateReratePlan').attr('disabled', true);
        // $('#BestReratePlan').attr('disabled', false);
        $('#ApplyChargeButton').attr('plan', 'bestplan');
        break;
      case 'availableplans':
        this.isShowBestPlan = false;
        this.isShowAvailableplans = true;
        this.isShowoverridePlans = false;
        this.isShownegotiatePlans = false;
        this.isDaysOfUsage = false;
        /* $('#AvilableReratePlan').attr('disabled', false);
        $('#OverrideReratePlan').attr('disabled', true);
        $('#NegotiateReratePlan').attr('disabled', true);
        $('#BestReratePlan').attr('disabled', true); */
        $('#ApplyChargeButton').attr('plan', 'availableplans');
        break;
      case 'overrideplan':
        this.isShowBestPlan = false;
        this.isDaysOfUsage = false;
        this.isShowAvailableplans = false;
        this.isShowoverridePlans = true;
        this.isShownegotiatePlans = false;
        /* $('#AvilableReratePlan').attr('disabled', true);
        $('#OverrideReratePlan').attr('disabled', false);
        $('#NegotiateReratePlan').attr('disabled', true);
        $('#BestReratePlan').attr('disabled', true); */
        $('#ApplyChargeButton').attr('plan', 'overrideplan');
        break;
      case 'negotiateplan':
        this.isShowBestPlan = false;
        this.isShowAvailableplans = false;
        this.isDaysOfUsage = false;
        this.isShowoverridePlans = false;
        this.isShownegotiatePlans = true;
        //  $('#AvilableReratePlan').attr('disabled', true);
        // $('#OverrideReratePlan').attr('disabled', true);
        // $('#NegotiateReratePlan').attr('disabled', false);
        // $('#BestReratePlan').attr('disabled', true); 
        $('#ApplyChargeButton').attr('plan', 'negotiateplan');
        break;

        default:
          $('#ApplyChargeButton').attr('plan', 'bestplan');
        break;
    }
    
  }

  caculcateBilledUsage() {
    var eligibleDomesticPlan = $('#EligibleFormControl').val();
    var dayUssage = $('#DayUsagetextbox').val();

    if(eligibleDomesticPlan == 'Yes'){
      if(dayUssage == '') {
        $('#DayUsagetextbox').addClass('outline-error');
        return false;
      }
    }
    $('#DayUsagetextbox').removeClass('outline-error');

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
    var value = parseInt($(event.currentTarget).val());
    var negotiateVal = $('#NegatiatePercentage').val() ? parseInt($('#NegatiatePercentage').val()) : 0;
   var costValue = (this.billedFinalValue / 100) * negotiateVal;
    if(value>100){
      $(event.currentTarget).val('0');
      return false;
    }
    this.adjustmentrate = this.billedFinalValue - costValue;
    this.remaingRoamingCharges = this.billedFinalValue - this.adjustmentrate;
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

