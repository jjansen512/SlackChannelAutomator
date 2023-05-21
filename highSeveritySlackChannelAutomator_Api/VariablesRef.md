# Common project template **refs**

## jQuery Vars

---

### Checks Values of Input Boxes

```js
$('#ticketInputPrompt').val();
$('#airportCodePrompt').val();
$('#regionInputPrompt').val();
$('#channelDetailsPrompt').val();
$('#channelTopicPrompt').val();
```

### Atribute Edits

- _Create Slack Channel Button Disabled:_

```js
$('#modalEditButtonToConfirmModal').attr('class', 'button-slack disabled');
```

- _Enabled_:

```js
$('#modalEditButtonToConfirmModal').attr('class', 'button-slack mr-auto');
```

_Inserts dots to modal display:_

```js
$('#ticketId').text('...');
$('#airportCode').text('...');
$('#regionCode').text('...');
$('#channelDetails').text('...');
$('#slackNotes').text('...');
```

## Javascript

---

### Event listeners

_Modal Edit Save Changes Button:_

```js
modalEditSaveChanges.addEventListener( 'click', ticketId_Monitor );
function ticketId_Monitor ()
{
      console.log( 'Running event list for Low-side Ticket Id monitoring ' );
      if ( !ticketInputPrompt )
      {
            console.log( 'Ticket ID alert triggered' );
            $( '#modalEditSaveChanges' ).attr( 'data-dismiss', '' );
            $( '#modalEditSaveChanges' ).attr(
                  'class',
                  'btn btn-primary-disabled'
            );
            $( '#modalEditSaveChanges' ).attr(
                  'style',
                  'background-color: #3D5963;'
            );
            const ModalEdit_HeaderTitle = document.getElementById(
                  'ModalEdit_HeaderTitle'
            );
            ModalEdit_HeaderTitle.innerHTML = `
```

```html
<div
	class="alert alert-warning d-flex align-items-center alert-dismissible fade show"
	id="ModalEdit_Alert_NoTicektID"
	role="alert"
>
	<svg
		class="bi flex-shrink-0 me-2"
		width="24"
		height="24"
		role="img"
		aria-label="Warning:"
	>
		<use xlink:href="#exclamation-triangle-fill" />
	</svg>
	<div id="ModalEdit_AlertBody"
		><span>The minimum requirement is to provide a Ticket ID.</span></div
	>
	<button
		type="button"
		id="modalEditAlertNoTicketIdButtonClose"
		class="btn-close"
		data-bs-dismiss="alert"
		style="opacity: 0;"
		aria-label="Close"
	></button>
</div>
```

```js
`;
      }
      if ( ticketInputPrompt )
      {
            $( '#modalEditSaveChanges' ).attr( 'class', 'btn btn-primary' );
            $( '#modalEditSaveChanges' ).removeAttr( 'style' );
            $( '#modalEditSaveChanges' ).attr( 'data-dismiss', 'modal' );
      }
}
```

### Cognito

```js

    async function GetPresignedURL() {
        AWS.config.region = 'us-east-1';
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:5f0cd34d-24d4-4195-b1c1-390eaebbab5c',
        });
```

### Pull data from array

```js
var jsonres = {
	ok: true,
	channel: {
		id: 'C04E2SFNWFL',
		name: 'v779667295-test474',
		is_channel: true,
		is_group: false,
		is_im: false,
		is_mpim: false,
		is_private: false,
		created: 1670387149,
		is_archived: false,
		is_general: false,
		unlinked: 0,
		name_normalized: 'v779667295-test474',
		is_shared: false,
		is_org_shared: false,
		is_pending_ext_shared: false,
		pending_shared: [],
		context_team_id: 'T049WPPB7GU',
		updated: 1670387149989,
		parent_conversation: null,
		creator: 'U04A0FU5X6F',
		is_moved: 0,
		is_ext_shared: false,
		shared_team_ids: ['T049WPPB7GU'],
		internal_team_ids: ['T049WPPB7GU'],
		pending_connected_team_ids: [],
		is_member: true,
		last_read: '0000000000.000000',
		topic: {
			value: '',
			creator: '',
			last_set: 0,
		},
		purpose: {
			value: '',
			creator: '',
			last_set: 0,
		},
		previous_names: [],
		priority: 0,
	},
};

console.log(jsonres);

console.log('Json parsed', jsonres.channel.id);
```

## Bash Shell

_If you need to add a version set and create a workspace..._

```shell
brazil ws create <name>
brazil ws use --package HighSeveritySlackChannelFirefox_Extension --versionSet HighSeveritySlackChannelFirefox_Extension/Prod_Clone
```

_Sequence to sync to youruserportal.yourcompany.com git_:

```shell
## Use --dry-run to test

git add .
git commit -m "Added regex params to better parse ticket numbers from urls"
git push --all
```
