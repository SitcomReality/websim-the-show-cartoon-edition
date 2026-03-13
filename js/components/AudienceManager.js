export class AudienceManager {
  constructor(containerId, isFixed = true) {
    this.container = document.getElementById(containerId);
    this.isFixed = isFixed;
    this.colors = ['#458588', '#b16286', '#d79921', '#689d6a', '#a89984'];
    this.rows = 0;
  }

  createMember(color) {
    const member = document.createElement('div');
    member.className = 'audience-member';
    member.style.setProperty('--member-color', color);
    member.innerHTML = `
      <div class="audience-head"></div>
      <div class="audience-shoulders"></div>
    `;
    return member;
  }

  createRow(rowIndex, count = 15) {
    const row = document.createElement('div');
    row.className = 'audience-row';
    for (let i = 0; i < count; i++) {
      const color = this.colors[(i + rowIndex) % this.colors.length];
      row.appendChild(this.createMember(color));
    }
    return row;
  }

  update(rowCount) {
    if (this.rows === rowCount) return;
    this.rows = rowCount;
    this.container.innerHTML = '';
    for (let i = 0; i < rowCount; i++) {
      this.container.appendChild(this.createRow(i));
    }
  }
}