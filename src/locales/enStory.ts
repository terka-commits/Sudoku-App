import type { StoryLocale } from './csStory';

export const enStory = {
  gameChapters: {
    'chapter-01-arrival': {
      title: 'PART I',
      subtitle: 'Arrival at the Hotel',
      tone: 'The first inconsistencies in case 214.',
      revealTitle: 'The First Connection',
      revealText:
        'Five rooms gave you five clues.\nEach one leads back to room 214.\nThe key, notebook, menu, receipt, and photograph form the first part of the case.\nThe hotel is full of guests, but the old case has just reopened.',
      revealCta: 'Continue the case',
    },
    'chapter-02-exploration': {
      title: 'PART II',
      subtitle: 'Exploring the Hotel',
      tone: 'The trail leads beyond the guest areas.',
      revealTitle: 'The Hidden Route',
      revealText:
        'The second part of the investigation led you beyond the hotel spaces guests normally see.\nThe library card, guest list, and cropped photograph showed that the case reaches farther than room 214.\nThe map fragment led you to a side staircase, and the staff key opened doors missing from the hotel plan.\nYou already know you should turn back.\nBut now you are closer to the truth than ever.',
      revealCta: 'Continue the case',
    },
    'chapter-03-staff-area': {
      title: 'PART III',
      subtitle: 'The Hidden Route',
      tone: 'The clues lead into the hotel staff area.',
      revealTitle: 'Staff Quarters',
      revealText:
        'The clues no longer point only to guests.\nThe note sheet, call record, coat tag, and night schedule show that someone on staff knew more than they admitted.\nThe service elevator also led you to a floor that does not exist on the hotel map.\nYou return to your room.\nIn the morning, you plan to contact the local police.\nBut the more clues you have, the clearer it becomes that someone carefully buried this case.',
      revealCta: 'Continue the case',
    },
    'chapter-04-shift-name': {
      title: 'PART IV',
      subtitle: 'A Name in the Records',
      tone: 'The same name starts appearing in the records.',
      revealTitle: 'Matching Names',
      revealText:
        'The case is starting to fit together.\nThe guest register, closed bill, spare key, shift schedule, and staff diary all point in the same direction.\nAccording to the records, the missing guests checked out, but their traces end inside the hotel.\nSomeone closed their stays.\nSomeone had access to room 214.\nAnd someone made sure it all looked accidental.',
      revealCta: 'Continue the case',
    },
    'chapter-05-case-214': {
      title: 'PART V',
      subtitle: 'Case 214',
      tone: 'The final five rooms complete the picture.',
      revealTitle: 'Case 214',
      revealText:
        'The clues return once more to room 214.\nThe old map, emergency light, forgotten suitcase, personal notebook, and witness statement revealed a part of the hotel meant to stay hidden.\nThe closed wing was not empty. And room 214 was not just a room.\nIt was the point every path led back to.',
      revealCta: 'Hand over clues',
    },
  },
  rooms: {
    'room-01': {
      locationName: 'Reception',
      shortDescription: 'The hook for room 214 is empty.',
      detailText:
        'Reception is ready for new guests.\nKeys hang on the wall behind the counter. The hook marked 214 is empty.\nThe receptionist searches for a moment, then asks you to wait.',
      clueTitle: 'Room 214 Key',
      clueDescription:
        'After a while, the receptionist returns with the key to room 214.\nShe found it in the back compartment of an old cabinet.\nThe tag carries the hotel’s original opening date.\nAfter the renovation, it should have been retired long ago.\nBut someone left it here.',
    },
    'room-02': {
      locationName: 'Room 214',
      shortDescription: 'You find a hotel notebook on the writing desk.',
      detailText:
        'The room is prepared for you. Clean sheets, closed windows, and a pleasant tea left waiting.\nOn the writing desk, you find a hotel notebook that does not look as if it belongs there.',
      clueTitle: 'Hotel Notebook',
      clueDescription:
        'The first pages contain ordinary instructions for hotel guests. On the last page, you notice part of the page is missing. In the hard cover of the notebook, you find several carved dates.\nOne matches the disappearance date mentioned in an old article.',
    },
    'room-03': {
      locationName: 'Hotel Restaurant',
      shortDescription: 'Some menus are different from the others.',
      detailText:
        'You move to the hotel restaurant.\nThe first dinner after the reopening is being prepared.\nThe tables are set as if guests might arrive at any moment.\nAt one of them lies an old dining menu.\nAt first glance, it does not belong here.',
      clueTitle: 'Original Dining Menu',
      rewardTitle: 'Old Menu',
      clueDescription:
        'A handwritten mark has been added to the edge of the old menu.\nYou try to decipher it and eventually recognize a table number.\nAccording to the old articles, one of the missing guests was last seen sitting there.',
    },
    'room-04': {
      locationName: 'Lobby Bar',
      shortDescription: 'A bar receipt is charged to room 214.',
      detailText:
        'The evening at the hotel is not over yet.\nFrom the restaurant, you move to the lobby bar.\nThe air mixes polished wood and brandy.\nFor a moment, you think you hear the laughter of guests from long ago.\nAn empty glass and a receipt lie on an unoccupied table.',
      clueTitle: 'Bar Receipt',
      clueDescription:
        'You pick up the receipt.\nAmong the brandy stains, you make out the number 214.\nThe paper is old, but someone left it directly on the table.\nThe date matches the evening when one of the guests was last seen.',
    },
    'room-05': {
      locationName: 'Winter Garden',
      shortDescription: 'A face is scratched out in one photograph.',
      detailText:
        'In the morning, you have breakfast in the winter garden.\nIt is quiet. Most guests are still asleep.\nPhotos from the hotel reopening hang on the wall.\nAmong them, you notice an older photo in a scratched frame.\nAt first glance, it does not belong here.',
      clueTitle: 'Old Photograph',
      clueDescription:
        'You take the photograph from the wall and turn it over.\nNumbers are written by hand on the back.\nAmong them, 214 appears again.\nThis time it is not beside a room, but beside the name of one of the missing guests.',
    },
    'room-06': {
      locationName: 'Hotel Library',
      shortDescription: 'A library card is tucked into a book about the hotel’s history.',
      detailText:
        'In one of the side corridors, you discover a small hotel library.\nIt feels quiet and carefully arranged, as if someone maintained it even during the years the hotel was closed.\nAmong the books, you find an old lending catalogue.\nOne card is tucked into a book about the hotel’s history.',
      clueTitle: 'Library Card',
      clueDescription:
        'The card carries the name of one of the missing guests.\nYou recognize him from the photograph you found in the winter garden.\nAccording to the record, the book was returned only after his disappearance.',
    },
    'room-07': {
      locationName: 'Banquet Hall',
      shortDescription: 'A memorial book lies on the piano.',
      detailText:
        'In the evening, you move to the banquet hall.\nQuiet piano music fills the room while guests talk over glasses of brandy.\nAn old guest book lies on the piano.\nBetween its pages, you find an inserted list from a hotel event.',
      clueTitle: 'Guest List',
      clueDescription:
        'You recognize several names from the old articles.\nThey belonged to guests who later disappeared.\nFor the first time, the trail leads beyond room 214.\nSome were last seen during hotel events.',
    },
    'room-08': {
      locationName: 'Hotel Gallery',
      shortDescription: 'One photograph has been deliberately cropped.',
      detailText:
        'On your way back, you pass through the hotel gallery.\nThe corridor is lined with photographs of the hotel from different eras.\nOne of them makes you stop.\nIt is clumsily cropped, as if someone deliberately removed more than just the edge.\nThe remaining image shows part of the hotel staff.',
      clueTitle: 'Cropped Photograph',
      clueDescription:
        'You examine the photograph more closely.\nOn one employee’s uniform, you notice a small badge.\nThe same badge appears in other old photos.\nSomeone from the staff was present at hotel events more often than expected.',
    },
    'room-09': {
      locationName: 'Side Staircase',
      shortDescription: 'The side staircase is missing from the corridor map.',
      detailText:
        'The second-floor corridor runs past the guest rooms.\nAt its end is room 214.\nAs you approach it, you notice a discreet side staircase.\nNo light is on there, and it is not marked on the hotel map.\nA torn piece of paper lies on the floor beneath the map frame.',
      clueTitle: 'Map Fragment',
      clueDescription:
        'You smooth out the torn paper and try to complete the missing part of the plan.\nIt shows a route from the rooms to the side staircase.\nBut this path is missing from the official hotel map.\nSomeone removed it deliberately.',
    },
    'room-10': {
      locationName: 'Hidden Staircase',
      shortDescription: 'You notice a metal tag with a key on the railing.',
      detailText:
        'You cannot leave it alone. You do not want to return to your room yet.\nYou step onto the side staircase missing from the hotel map.\nIt is narrow, dark, and leads into a part of the hotel guests normally never enter.\nA small key with a metal tag hangs from the railing.',
      clueTitle: 'Staff Area Key',
      clueDescription:
        'The staircase leads you to a narrow door.\nIt is locked.\nYou try the key that hung from the railing.\nAfter a moment, the lock gives way.\nYou step inside.',
    },
    'room-11': {
      locationName: 'Hotel Office',
      shortDescription: 'A note sheet sticks out of one folder.',
      detailText:
        'Behind the staff-area door, you discover the hotel office.\nBinders, operation records, and scattered notes cover the desk.\nThe room feels abandoned, but not empty.\nA freshly written sheet sticks out of one folder.',
      clueTitle: 'Note Sheet',
      clueDescription:
        'The ink on the note has not fully dried.\nThe handwriting is hard to read, but you recognize several words.\n“214,” “guests,” and “do not let through.”\nSomeone was here shortly before you.',
    },
    'room-12': {
      locationName: 'Telephone Switchboard',
      shortDescription: 'You search for the phone connected to room 214.',
      detailText:
        'A quiet telephone ring comes from the next room.\nYou enter and find yourself beside the old hotel switchboard.\nCables, switches, and dusty phones line the walls.\nThe switchboard has not been used in years, yet call records remain here.\nYou start looking for the number of room 214.',
      clueTitle: 'Call Record',
      clueDescription:
        'In the records, you find a call from room 214.\nIt happened late in the evening and repeated again in the morning.\nBut room 214 was supposed to be closed after the first disappearance.\nNo one should have been calling from there.',
    },
    'room-13': {
      locationName: 'Laundry',
      shortDescription: 'Among old shelves, you notice a coat tag.',
      detailText:
        'Deep in the hotel staff area, you find the laundry.\nUniforms and old staff coats hang from racks.\nMost things look new, but one coat is noticeably older than the rest.\nA small paper tag peeks out of its pocket.',
      clueTitle: 'Coat Tag',
      clueDescription:
        'You pull the tag from the pocket of the old coat.\nThe number 214 is written on it.\nBut the coat did not belong to a guest. It hung among staff belongings.\nSomeone on staff was closer to the room than they should have been.',
    },
    'room-14': {
      locationName: 'Kitchen Corridor',
      shortDescription: 'An old night schedule remains on the noticeboard.',
      detailText:
        'You hear a quiet metallic sound from the corridor.\nYou follow it and find yourself in a narrow passage behind the hotel kitchen.\nIt connects the restaurant to the staff area, and at night only staff should have access.\nAn old night-shift schedule hangs on the noticeboard.',
      clueTitle: 'Night Schedule',
      clueDescription:
        'You review the shift schedule from the night one of the first guests disappeared.\nBeside one time, there is a handwritten note.\nIt is short and unfinished, as if the writer was interrupted.\nYou can read only a few words: “214,” “staircase,” and “do not go alone.”',
    },
    'room-15': {
      locationName: 'Service Elevator',
      shortDescription: 'The controls inside look recently used.',
      detailText:
        'At the end of the kitchen corridor, you notice the service elevator.\nIt is hidden behind narrow doors in the rear part of the staff area.\nAccording to the sign, it should have been out of service for years.\nBut the control panel is clean, as if someone touched it recently.\nAn old service record hangs beside the elevator.',
      clueTitle: 'Service Record',
      clueDescription:
        'In the service record, you find several recent entries.\nThe elevator should have been out of service, but someone used it anyway.\nThe last ride leads to a floor that is not on the hotel map.\nBefore you can learn more, you hear footsteps in the corridor.\nYou return to your room.',
    },
    'room-16': {
      locationName: 'Guest Archive',
      shortDescription: 'You decide to search the guest archive yourself.',
      detailText:
        'The next day, you wait for a response from the police.\nNone comes.\n\nSo you decide to search the guest records yourself.\nIn one staff room, you find an old archive of arrivals and departures.\nAmong the folders is a register from the period of the first disappearances.',
      clueTitle: 'Guest Register',
      clueDescription:
        'You go through the old records line by line.\nSeveral guests have the same arrival and departure times.\nIt does not look like coincidence.\nYou recognize the same names from the winter garden photograph.\nThey were in the hotel at the same time. According to the records, each one separately.',
    },
    'room-17': {
      locationName: 'Guest Documents',
      shortDescription: 'You need access to the guest documents too.',
      detailText:
        'Arrival and departure times are not enough.\nYou need to learn how the missing guests’ stays were closed.\n\nIn the hotel records, you find a folder of old bills and documents.\nSeveral belong to names you already know from the list and photograph.\nOne document is filed separately.',
      clueTitle: 'Closed Bill',
      clueDescription:
        'The document is marked as closed.\nIt is missing the guest’s checkout confirmation.\nThe same pattern repeats with other missing guests.\nSomeone closed their stays for them.',
    },
    'room-18': {
      locationName: 'Key Storage',
      shortDescription: 'You need to find the right key in storage.',
      detailText:
        'You need to get behind reception.\nDuring the day, someone would easily notice you there.\n\nYou saw that the room is locked at night.\nIn key storage, you search for the right one.\nSome tags are new; others have been turned number-side to the wall.',
      clueTitle: 'Spare Key',
      clueDescription:
        'The key unlocks the door behind reception.\nOne side marks it as a spare.\nBut on the other side, a scratched-out number remains.\nYou cannot read all of it, but it resembles a room number.\nSomeone relabeled this key.',
    },
    'room-19': {
      locationName: 'Staff Room',
      shortDescription: 'Shift schedules are scattered across the table.',
      detailText:
        'Behind reception, you find the staff room.\nShift schedules, notes, and old operation records lie on the table.\nYou start searching for the days when hotel guests disappeared.\nSeveral names appear suspiciously often on night shifts.',
      clueTitle: 'Shift Schedule',
      clueDescription:
        'You compare the shifts with the disappearance dates.\nThe same names repeat every night.\nThese people must have been questioned back then.\nYet their connection never appeared in the articles.',
    },
    'room-20': {
      locationName: 'Manager’s Office',
      shortDescription: 'You need something personal that belongs directly to the staff.',
      detailText:
        'The service elevator had to lead somewhere.\nThe next night, you return to the hotel staff area.\nBehind one locked door, you discover an office missing from the hotel plan.\nOn the desk lies the personal diary of one employee.\nSeveral pages have been torn out.',
      clueTitle: 'Staff Diary',
      clueDescription:
        'The diary is incomplete. Someone tore out several pages.\nThe remaining pages contain times that match the guest disappearances.\nOne entry shows the number 214 again.\nThis time beside an employee’s initials.',
    },
    'room-21': {
      locationName: 'Old Map',
      shortDescription: 'You find an old hotel map behind the door.',
      detailText:
        'At night, you return to the manager’s office.\nThe service elevator had to lead farther than the official hotel map showed.\nIn a drawer beneath the desk, you find an old building plan.\nThe elevator is drawn differently from the guest maps.\nBeside its shaft, someone has written a number combination by hand.',
      clueTitle: 'Old Map',
      clueDescription:
        'You compare the old plan with what you already know about the service elevator.\nThe number combination does not belong to any normal floor.\nYou enter it into the control panel.\nAfter a moment, the elevator starts moving.\nIt is heading to a part of the hotel that does not exist on guest maps.',
    },
    'room-22': {
      locationName: 'Elevator Machine Room',
      shortDescription: 'The machine room is cold and dark.',
      detailText:
        'The elevator begins to move.\nYou do not know where it will stop or what waits behind the doors.\n\nAfter a moment, the cabin shakes and comes to a halt.\nThe doors open into a cold machine room.\nIt is dark, metallic-smelling, and filled with the quiet hum of an old mechanism.\nOn the wall, you spot a cabinet with emergency lighting.',
      clueTitle: 'Emergency Light',
      clueDescription:
        'You turn on the emergency light.\nThe weak glow reveals a service corridor behind the elevator.\nIn the dust on the floor, you see fresh footprints.\nSomeone passed through here recently.',
    },
    'room-23': {
      locationName: 'Closed Wing',
      shortDescription: 'There was not a single mention of this in the newspapers.',
      detailText:
        'A narrow service corridor leads from the machine room.\nAt its end stands a heavy, unmarked door.\n\nWhen you open it, you enter a closed wing of the hotel.\nIt does not exist on guest plans, and old articles never mentioned it.\nA forgotten suitcase lies in the dust by the wall.',
      clueTitle: 'Forgotten Suitcase',
      clueDescription:
        'The suitcase is dusty, but not as dusty as it should be after so many years.\nSomeone must have moved it recently.\n\nOn the tag, you make out the name of one of the missing guests.\nYou already know the same name from the guest book, documents, and staff diary.\nOn the other side of the tag is the number 214.',
    },
    'room-24': {
      locationName: 'Room in the Closed Wing',
      shortDescription: 'Some kind of diary lies on the table.',
      detailText:
        'In the closed wing, you find a small room.\nIt does not feel like a guest room. More like a place where someone slept apart from everyone else.\nIt is sparsely furnished: a bed, a table, and an old lamp.\nA personal notebook lies on the table.',
      clueTitle: 'Personal Notebook',
      clueDescription:
        'The notebook repeats room numbers, times, and guest names.\nThe handwriting matches the diary from the manager’s office.\nSomeone kept their own list outside the official records.\nFootsteps sound behind the door.',
    },
    'room-25': {
      locationName: 'Room 214',
      shortDescription: 'Someone is approaching. You need to hide.',
      detailText:
        'Footsteps sound behind the door.\nSomeone is walking through the closed wing corridor straight toward you.\n\nYou turn off the lamp and look around the room.\nThe furniture is old and fragile; nowhere is safe to hide.\nThen you notice a door ajar at the end of the corridor.\n\nThe faded tag reads 214.',
      clueTitle: 'Witness Statement',
      clueDescription:
        'You slip into room 214 and close the door behind you.\nIn the nightstand drawer, you find folded papers.\nIt is a witness statement from one of the missing guests.\nIt describes the hidden route, the service elevator, and someone from the staff.\nThe footsteps stop outside the door.',
    },
  },
} satisfies StoryLocale;
