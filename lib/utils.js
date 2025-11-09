export function calculateBMI(weight, height) {
  const heightInMeters = height / 100
  return (weight / (heightInMeters * heightInMeters)).toFixed(1)
}

export function getBMICategory(bmi) {
  if (bmi < 18.5) return 'Underweight'
  if (bmi < 25) return 'Normal'
  if (bmi < 30) return 'Overweight'
  return 'Obese'
}
