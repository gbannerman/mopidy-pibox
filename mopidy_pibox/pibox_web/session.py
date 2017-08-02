class PiboxSession(object):

	def __init__(self):
		self.blacklist = ['spotify:track:312A8WfROSLvZbMDHBUPDp', 'spotify:track:42F4K181FFdhkbDAaoxDye']
		self.count = 0
		self.votes = {}
		