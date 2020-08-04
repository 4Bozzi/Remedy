# Remedy

This is a take home assessment project I did for Remedy (https://myremedy.com/). The idea is that a person in need of emergency assistance can come to the site and be linked up to a medical professal via a video call.

Currently you select either "I have an emergency" or "I am a doctor".

If you click "I am a doctor" you will be added to a pool of available doctors. If there are already patients in a queue you will immediately be connected
to the next one in the queue. If there are no patients queued you will be taken to a waiting screen until a patient joins.

If you click "I have an emergency" a check is made to see if there are any doctors in the available pool (online but not on a call). If there is a doctor 
you will immediately be connected. If not you will be taken to a waiting screen and be put into the patient queue.

When a doctor disconnects from a video, there is an immediate check to see if there is a patient in the queue. If so the doctor will be connected to the
first patient in the queue. If no patients are in the queue, the doctor will be taken back to the waiting screen (waiting for a patient to connect).

Known issues:
It seems like the browser is blocking sound. Twilio docs mention that automatically starting a video with sound is a no-go to most browsers so there probably
needs to be some controls that show up to enable sound at the start.

There are some visual issues, such as if the other participant exits the call, your video shrinks and hides the disconnect button. 
I didn't have time to....remedy...this. (I'm terrible, I know). 

Additionally, right now everyone gets more or less random names but the names aren't displayed anywhere. It would make sense to have users have accounts with names
and display that information. 

There is the obvious issue where anyone can click "I am a doctor" without authenticating.

