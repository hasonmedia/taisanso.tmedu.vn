export function capToLetter(cap) {
    switch (cap) {
        case 0: return 'root'
        case 1: return 'Quản trị viên';
        case 2: return 'Trưởng bộ phận';
        case 3: return 'Nhân viên';
        default: return ''; 
    }
}