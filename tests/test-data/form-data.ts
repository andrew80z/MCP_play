export const TEST_DATA = {
    FULL_FORM: {
        username: 'test.user@example.com',
        password: 'SecurePass123',
        comments: 'This is a test comment',
        checkboxIndex: 0,
        radioIndex: 0,
        dropdownValue: 'dd1',
        multiSelectValues: ['ms1', 'ms2']
    },
    MINIMAL_FORM: {
        username: 'minimal.user@example.com'
    }
};

export const EXPECTED_RESULTS = {
    SUCCESS_MESSAGE: 'Processed form data'
};