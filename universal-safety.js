/* Safety guard for universal answers. It does not diagnose. */
(function(){
  window.SaidSafety={isUrgent:function(q){return /\b(plötslig|svårt att andas|medvetslös|kramper|stroke|bröstsmärta|allvarlig skada)\b/i.test(String(q||''))},
    disclaimer:function(){return 'Detta är allmän information och ersätter inte professionell bedömning.'}};
})();
