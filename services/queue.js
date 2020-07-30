/**
 * Assumptions:
 * The user just selected an ailment on the front end and the req has been routed here.
 * 
 * What we need is to compare Doctors abilities against the problem
 * 
 * Once we have identified the list of doctors that could help this patient we need to 
 * check their availability. (Are they currently on a call).
 * 
 * Once we have narrowed down the list to only available doctors or and empty list we need
 * to assign a doctor to the patient (and remove the doctor from available) 
 * or add the patient to the queue.
 * 
 * Once a doctor has finished a "call" or "visit" we need to add them back in and assess whether or not
 * the doctor needs to treat another patient
 *
 */