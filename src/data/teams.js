export const teams = [
	{
		userId: 'robinson-0001',
		name: 'Robinson',
		email: 'dotcamediahub@gmail.com',
		projectAccess: {
			roles: ['admin','photographer'],
			accessLevel: 'full-access'
		}
	},
	{
		userId: 'abhay-0000',
		email: 'abhaykvincent@gmail.com',
		projectAccess: {
			roles: ['admin','developer'],
			accessLevel: 'full-access'
		}
	}
];
export const fullAccess = (email) => {
    return teams.some(team => team.email === email && team.projectAccess.accessLevel === 'full-access');
};