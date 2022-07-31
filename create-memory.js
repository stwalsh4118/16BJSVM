//use the arraybuffer to store the memory
//use the dataview to read and write to the memory using the dataview is slower than more optimized options but,
//it is a good easy implementation for now we can always come back later
/**
 * @param  {number} sizeInBytes: give the size of the memory chunk you want to create in bytes
 *
 * @return {DataView}: returns a DataView that contains a reference to the ArrayBuffer used to simulate the memory
 */
const createMemory = (sizeInBytes) => {
	const ab = new ArrayBuffer(sizeInBytes);
	const dv = new DataView(ab);
	return dv;
};

module.exports = createMemory;
